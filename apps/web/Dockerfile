# apps/web/Dockerfile
# Multi-stage build for Next.js app (Node 22)
FROM node:22-alpine AS deps
WORKDIR /app

# Prevent dev git hooks from running in Docker (husky, etc.)
ENV HUSKY=0

COPY package*.json ./
COPY apps/web/package*.json apps/web/

# Skip lifecycle scripts to avoid bash/husky
RUN npm ci --ignore-scripts

# ---------- Build stage ----------
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_BASE_API_URL
ENV NEXT_PUBLIC_BASE_API_URL=$NEXT_PUBLIC_BASE_API_URL


WORKDIR /app/apps/web
# Build Next.js app
RUN npm run build

# ---------- Runtime stage ----------
FROM node:22-alpine AS runner
WORKDIR /app/apps/web

ENV NODE_ENV=production
# Copy Next build artifacts and minimal required files
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/package*.json ./
COPY --from=builder /app/node_modules /app/node_modules

EXPOSE 3000

CMD ["npm", "run", "serve"]