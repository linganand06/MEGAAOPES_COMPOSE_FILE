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

# Copy compiled files and package.json separately
COPY --from=build /app .
COPY entrypoint.sh .

RUN npm install

RUN chmod +x entrypoint.sh

EXPOSE 5000

# Run the entrypoint script
CMD ["./entrypoint.sh"]
