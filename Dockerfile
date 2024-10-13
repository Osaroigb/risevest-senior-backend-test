# Use the official Node.js image as a base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the application's port
EXPOSE 3300

# Define environment variables
ENV NODE_ENV=production

# Start the Node.js application
CMD ["npm", "start"]
