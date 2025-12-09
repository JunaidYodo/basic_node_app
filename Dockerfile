# =============================================
# Stage 1: Dependencies & Prisma Client Build
# =============================================
FROM node:20-alpine AS deps

WORKDIR /app

# Install system dependencies (needed for Prisma & bcrypt)
RUN apk update && apk add --no-cache \
    libc6-compat \
    openssl \
    python3 \
    make \
    g++

# Copy package files
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install ALL dependencies including devDependencies
RUN npm ci --include=dev

# SET DUMMY DATABASE_URL for prisma generate
ENV DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy?schema=public"

# Generate Prisma client
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

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

# Install curl for health check
RUN apk update && apk add --no-cache curl

# Create required directories as root
RUN mkdir -p temp_uploads public

# Copy files (as root by default)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY --from=builder /app ./

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["node", "--experimental-loader=extensionless", "server.js"]