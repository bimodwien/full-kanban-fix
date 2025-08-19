# apps/api/Dockerfile
# Multi-stage build for the Express + Prisma API (Node 22)
FROM node:22-alpine AS deps
WORKDIR /app

# Prevent dev git hooks from running in Docker (husky, etc.)
ENV HUSKY=0a

# Copy root and app manifests to leverage npm workspaces
COPY package*.json ./
COPY apps/api/package*.json apps/api/

# Install deps at root (workspaces) but skip lifecycle scripts (no bash/husky)
RUN npm ci --ignore-scripts

# ---------- Build stage ----------
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build API and generate Prisma client
WORKDIR /app/apps/api
RUN npm run build && npx prisma generate

# ---------- Runtime stage ----------
FROM node:22-alpine AS runner
WORKDIR /app/apps/api

ENV NODE_ENV=production
ENV PRISMA_GENERATE_SKIP_POSTINSTALL=1

# Copy compiled output and necessary files
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/package*.json ./
COPY --from=builder /app/node_modules /app/node_modules

EXPOSE 8000

# Run pending migrations (safe in prod) then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]