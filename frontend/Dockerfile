# Step 1: Build the React app
FROM node:23 AS builder

WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the entire project
COPY . .

# Build the React app
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:latest

# Copy built React files to Nginx's default directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy a custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3010
EXPOSE 3010

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

