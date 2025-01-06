# Stage 1: Backend setup
FROM node:18 AS backend

# Set the working directory for the backend
WORKDIR /app/backend

# Copy backend files
COPY backend/package*.json ./

# Install dependencies and build the backend
RUN npm install
COPY backend/ .
RUN npm run build

# Stage 2: Frontend setup
FROM node:18 AS frontend

# Set the working directory for the frontend
WORKDIR /app/frontend

# Copy frontend files
COPY frontend/package*.json ./

# Install dependencies and build the frontend
RUN npm install
COPY frontend/ .
RUN npm run build

# Final stage: Start the backend and frontend
FROM node:18 AS final

# Backend setup
WORKDIR /app/backend
COPY --from=backend /app/backend ./

# Frontend setup
WORKDIR /app/frontend
COPY --from=frontend /app/frontend ./

# Default command to run both frontend and backend
CMD ["sh", "-c", "cd /app/backend && node dist/server.js & cd /app/frontend && npm run dev"]
