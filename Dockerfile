# Use the official Node.js image for React
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the React application
RUN npm run build

# Use a lightweight web server for serving React (e.g., serve)
RUN npm install -g serve

# Command to serve the built files
CMD ["serve", "-s", "dist"]

# Expose the default port
EXPOSE 3000
