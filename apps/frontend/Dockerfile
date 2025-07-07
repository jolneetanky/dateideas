# --- Install dependencies and build ---
FROM node:18-alpine AS builder
WORKDIR /app

# pass this in explicitely as build arg, because no .env
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

COPY . .
RUN npm install
RUN npm run build

# --- Production image ---
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# NOTE: `./src` is used during build, but not copied in the final image cause it's alr compiled under ./next

EXPOSE 3000
CMD ["npm", "start"]