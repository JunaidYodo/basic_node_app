# =============================================
# Stage 1: Dependencies & Prisma Client Build
# =============================================
FROM node:20-alpine AS deps

WORKDIR /app

# Install system dependencies
RUN apk update && apk add --no-cache \
    libc6-compat \
    openssl \
    openssl-dev \
    python3 \
    make \
    g++

# Copy package files and Prisma schema
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install ALL dependencies including devDependencies
RUN npm ci --include=dev

# 2. NOW copy Prisma schema and generate client
COPY prisma ./prisma/
RUN PRISMA_CLI_BINARY_TARGETS=linux-musl-openssl-3.0.x npx prisma generate

# =============================================
# Stage 2: Production Dependencies
# =============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL for any native module builds
RUN apk update && apk add --no-cache openssl libc6-compat

COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy Prisma client from deps stage (CRITICAL)
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma/
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma/

COPY . .

# =============================================
# Stage 3: Production Image
# =============================================
FROM node:20-alpine

ARG BUILD_VERSION="1.0.0"
ARG BUILD_DATE
ARG COMMIT_SHA

ENV NODE_ENV=development
ENV PORT=3000

WORKDIR /app

# Install runtime dependencies
RUN apk update && apk add --no-cache curl openssl libc6-compat

# Create required directories
RUN mkdir -p temp_uploads public logs

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001
USER nextjs

# Copy application files
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app ./

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000

# Startup command
CMD ["sh", "-c", "export DATABASE_URL=\"postgresql://${DB_USERNAME}:$(echo ${DB_PASSWORD} | sed 's/\\//\\\\\\//g')@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require\" && npm run start"]