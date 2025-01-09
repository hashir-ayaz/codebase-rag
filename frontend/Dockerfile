# Use Node.js 18 for the frontend
FROM node:18-alpine

# Set the working directory for the frontend
WORKDIR /app

# Copy frontend files
COPY package*.json ./

# Install dependencies and build the frontend
RUN npm install
COPY . .
RUN npm run build

# Expose the frontend port
EXPOSE 5173

# Start the frontend development server
CMD ["npm", "run", "dev"]
