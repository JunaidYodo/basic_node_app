# =============================================
# Stage 1: Dependencies & Prisma Client Build
# =============================================
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev deps for prisma generate)
RUN npm ci --include=dev

# Generate Prisma client (requires @prisma/client which is now installed)
RUN npx prisma generate

# =============================================
# Stage 2: Builder (with dev deps for build if needed)
# =============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy generated Prisma client from deps stage
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma/
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma/

# Copy source code
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

# Copy only production dependencies from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy Prisma schema (optional, for migrations at runtime)
COPY --from=deps --chown=nodejs:nodejs /app/prisma ./prisma

# Copy application code from builder stage
COPY --from=builder --chown=nodejs:nodejs /app ./

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

EXPOSE 3000

CMD ["node", "server.js"]