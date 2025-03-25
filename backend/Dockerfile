# Use official Node.js LTS image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application (if you have a build step)
# RUN npm run build

# Expose the port your app runs on
EXPOSE 3004

# Set environment variables
ENV MONGODB_URI=mongodb+srv://darkboy25:AnsieversarY25@cluster0.xop3g.mongodb.net/algoroot-task-manager?retryWrites=true&w=majority
ENV PORT=3004
ENV NODE_ENV=production

# Command to run the application
CMD ["npm", "start"]