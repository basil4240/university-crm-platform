FROM node:22-alpine AS development

# Working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the file
COPY . .

# Start the application
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && npm run start:dev"]
