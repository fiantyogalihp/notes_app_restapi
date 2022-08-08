# Process Manager

notes app backend REST API with AWS EC2 Instance, stay server active with process manager

## Create and Start server (in first time only)

$ pm2 start npm --name "notes-api" -- run "start-prod"

## Restart server

$ pm2 restart notes-api

## Stop server

$ pm2 stop notes-api

## Start server

$ pm2 start notes-api
