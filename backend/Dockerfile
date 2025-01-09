# Use Node.js 18 for the backend
FROM node:18-alpine

# Set the working directory for the backend
WORKDIR /app

# Copy backend files
COPY package*.json ./

# Install dependencies and build the backend
RUN npm install
COPY . .
RUN npm run build

# Expose the backend port
EXPOSE 3000

# Start the backend
CMD ["node", "dist/server.js"]
