#!/bin/sh

# Run the database initialization script
npm run db:init

# Start the application
exec npm start
