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

# Generate Prisma client (no DATABASE_URL needed for generate)
RUN npx prisma generate

# =============================================
# Stage 2: Production Dependencies
# =============================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy Prisma client from deps stage
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

# Environment variables
ENV NODE_ENV=development
ENV PORT=3000

# Labels for metadata
LABEL org.label-schema.version=$BUILD_VERSION \
      org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.vcs-ref=$COMMIT_SHA

WORKDIR /app

# Install curl for health check
RUN apk update && apk add --no-cache curl

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

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000

# Startup command - runs migrations then starts the app
CMD ["sh", "-c", "export DATABASE_URL=\"postgresql://${DB_USERNAME}:$(echo ${DB_PASSWORD} | sed 's/\\//\\\\\\//g')@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require\" && npm run prisma:dev && node --experimental-loader=extensionless server.js"]