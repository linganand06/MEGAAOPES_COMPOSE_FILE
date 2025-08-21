# Stage 1: Build the TypeScript backend
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Compile TypeScript to JavaScript (outputs to dist/)
RUN npm run build

# Stage 2: Run the compiled JavaScript
FROM node:18-alpine

WORKDIR /app

# Copy production dependencies and compiled code from the build stage
COPY --from=build /app/package*.json ./
RUN npm install --production
COPY --from=build /app/dist ./dist
COPY --from=build /app/sql ./sql

EXPOSE 5000

# Start the application
CMD ["npm", "start"]
