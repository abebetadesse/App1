#!/bin/bash
cd "$(dirname "$0")/.."
npx json-server server/db.json --port 3001 --routes server/routes.json --middlewares server/cors.js
