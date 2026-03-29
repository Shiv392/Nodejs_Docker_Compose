# Use official Node.js 20 Alpine base image for a lightweight container
FROM node:20-alpine

# Create and set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies (npm ci uses package-lock.json for reproducible builds)
RUN npm ci

# Copy the rest of your app source code
COPY . .

# Expose the port your app listens on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]