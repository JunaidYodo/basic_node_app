# =============================================
# Stage 1: Dependencies & Prisma Client Build
# =============================================
FROM node:20-bullseye-slim AS deps

WORKDIR /app

RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files and Prisma schema
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including dev for Prisma)
RUN npm ci

# Generate Prisma client at build time
RUN npx prisma generate

# =============================================
# Stage 2: Production Dependencies & App Build
# =============================================
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Install system packages
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy Prisma client from deps stage
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma

# Copy application source
COPY . .

# =============================================
# Stage 3: Runtime Image (Private ECS Safe)
# =============================================
FROM node:20-bullseye-slim

ARG BUILD_VERSION="1.0.0"
ARG BUILD_DATE
ARG COMMIT_SHA

ENV NODE_ENV=production
ENV PORT=3000

LABEL org.label-schema.version=$BUILD_VERSION \
      org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.vcs-ref=$COMMIT_SHA

WORKDIR /app

# Runtime system packages
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create required directories
RUN mkdir -p temp_uploads public logs

# Create non-root user
RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs -m nextjs

# Copy app files
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app ./

USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["sh", "-c", "export DATABASE_URL=\"postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require\" && npm run start"]
