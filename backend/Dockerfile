# Building Stage of the Application
FROM node:22-alpine AS build

# Working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the file
COPY . .

# Building the application
CMD ["npm", "run", "build"]


# Production statge of the application
FROM node:22-alpine as production

# Working directory
WORKDIR /app

# copy the dist folder
COPY --from=build /app/dist ./dist

# Start the application
CMD ["npm", "run", "start:prod"]