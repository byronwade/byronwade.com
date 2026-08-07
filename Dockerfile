# syntax=docker/dockerfile:1

# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# sharp builds native bindings; python3/make/g++ are only needed here, never at runtime.
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
# `npm ci` installs exactly the lockfile. Lifecycle scripts must run so sharp
# fetches its platform binary, without them image optimization fails at runtime.
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# wget backs the HEALTHCHECK below; the base image ships neither wget nor curl.
RUN apk add --no-cache wget

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# `output: "standalone"` emits a self-contained server plus a pruned node_modules.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
	CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
