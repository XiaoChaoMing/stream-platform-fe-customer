FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
COPY package.json ./
RUN npm install --legacy-peer-deps -g npm && \
    npm install --legacy-peer-deps

# Building the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built assets from the builder stage
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 8084

# Run nginx
CMD ["nginx", "-g", "daemon off;"] 