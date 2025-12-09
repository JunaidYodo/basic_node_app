# =============================================
# Stage 1: Dependencies & Prisma Client Build
# =============================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install ALL dependencies including devDependencies
# DO NOT use --no-save installs before this!
RUN npm ci --include=dev

# Debug: Verify prisma packages are installed
RUN npm list prisma @prisma/client

# Generate Prisma client
RUN npx prisma generate

# =============================================
# Stage 2: Production Dependencies
# =============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy generated Prisma client from deps stage
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma/
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma/

# Copy application code
COPY . .

# =============================================
# Stage 3: Production Image
# =============================================
FROM node:20-alpine

ARG BUILD_VERSION="1.0.0"
ARG BUILD_DATE
ARG COMMIT_SHA

LABEL maintainer="devops-team"
LABEL version="${BUILD_VERSION}"
LABEL build-date="${BUILD_DATE}"
LABEL commit-sha="${COMMIT_SHA}"
LABEL description="Node.js Application"

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy production dependencies
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy Prisma schema
COPY --from=deps --chown=nodejs:nodejs /app/prisma ./prisma

# Copy application code
COPY --from=builder --chown=nodejs:nodejs /app ./

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

EXPOSE 3000

CMD ["node", "server.js"]