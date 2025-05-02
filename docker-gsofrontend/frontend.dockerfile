# Use the official Node.js 20 Alpine image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy only package.json and lock file
COPY package*.json ./

# Install dependencies using clean install for consistency
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the Vite development server port
EXPOSE 5173

# Optional: Use polling for file changes (needed on some OS setups)
ENV CHOKIDAR_USEPOLLING=true

# Start the Vite development server
CMD ["npm", "run", "dev"]

