FROM node:22-alpine AS backend

# Working directory
WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the file
COPY . .

# Start the application
# CMD ["npm", "run", "start:dev"]
CMD ["npx prisma migrate deploy && npx prisma generate && npm run start:dev"]
