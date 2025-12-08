# =============================================
# Stage 1: Dependencies & Prisma Client Build
# =============================================
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

RUN npx prisma generate

# =============================================
# Stage 2: Builder (with dev deps for build if needed)
# =============================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

COPY . .

RUN npm ci --only=production

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

COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs . .

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

EXPOSE 3000

CMD ["node", "server.js"]