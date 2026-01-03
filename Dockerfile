# Use Node.js LTS version
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install dependencies for native modules (bcrypt, pg)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install all dependencies (needed for build and runtime)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
