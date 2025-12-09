# =============================================
# Stage 1: Dependencies & Prisma Client Build
# =============================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install ALL dependencies including devDependencies
RUN npm ci --include=dev

# SET DUMMY DATABASE_URL for prisma generate (schema validation only)
ENV DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy?schema=public"

# Generate Prisma client (works with dummy URL)
RUN npx prisma generate

# =============================================
# Stage 2: Production Dependencies
# =============================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

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

# RUNTIME environment variables (set by ECS/Container)
# DATABASE_URL will be provided by ECS task definition
ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app ./

USER nodejs

EXPOSE 3000
CMD ["node", "server.js"]