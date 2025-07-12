# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Only copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies (layer will be cached unless packages change)
RUN npm install

# Now copy the rest of your app
COPY . .

# Expose port (set by environment or default)
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
