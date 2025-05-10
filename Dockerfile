# Stage 1 — Install dependencies and build Next.js app
FROM node:20-alpine AS builder

# Install dependencies
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2 — Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Chỉ copy những file cần cho production (đỡ nặng)
COPY --from=builder /app/package.json /app/package-lock.json* ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start"]
