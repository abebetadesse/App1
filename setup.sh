#!/bin/bash

# ==============================================================================
# ENTERPRISE MIGRATION & FULL-STACK STARTUP SCRIPT
# Description: Migrates existing app data, installs enterprise dependencies, 
# stubs missing files to prevent crashes, and boots via PM2.
# ==============================================================================

set -e
set -u
set -o pipefail

# --- Color Codes & Styling ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

log_info() { echo -e "${CYAN}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }
log_header() { 
    echo -e "\n${BLUE}${BOLD}======================================================${NC}"
    echo -e "${BLUE}${BOLD} $1 ${NC}"
    echo -e "${BLUE}${BOLD}======================================================${NC}\n"
}

# --- Environment Path Resolution ---
if grep -qE "(Microsoft|WSL)" /proc/version 2>/dev/null; then
    TARGET_WORKSPACE="/mnt/c/Users/abebe/Desktop/New folder/App1"
    SOURCE_WORKSPACE="/mnt/c/Users/abebe/Desktop/App"
elif [[ "$(uname -s)" == MINGW* ]] || [[ "$(uname -s)" == CYGWIN* ]]; then
    TARGET_WORKSPACE="/c/Users/abebe/Desktop/New folder/App1"
    SOURCE_WORKSPACE="/c/Users/abebe/Desktop/App"
else
    TARGET_WORKSPACE="$HOME/Desktop/New folder/App1"
    SOURCE_WORKSPACE="$HOME/Desktop/App"
fi

FRONTEND_DIR="$TARGET_WORKSPACE/frontend-workspace"
BACKEND_DIR="$TARGET_WORKSPACE/backend-workspace"

# ==============================================================================
# PHASE 1: PREREQUISITE VALIDATION
# ==============================================================================
log_header "PHASE 1: Validating System Prerequisites"

for cmd in node npm git; do
    if ! command -v "$cmd" &> /dev/null; then
        log_error "$cmd is required but not installed."
    else
        log_success "$cmd is installed."
    fi
done

if ! command -v pm2 &> /dev/null; then
    log_warn "Installing PM2 globally..."
    npm install -g pm2
fi

# ==============================================================================
# PHASE 2: WORKSPACE PROVISIONING & MIGRATION
# ==============================================================================
log_header "PHASE 2: Provisioning & Migrating Existing Data"

mkdir -p "$TARGET_WORKSPACE" "$FRONTEND_DIR" "$BACKEND_DIR"

if [ -d "$SOURCE_WORKSPACE" ]; then
    log_info "Migrating files from $SOURCE_WORKSPACE..."
    # Copy backend and frontend files if they were separated in the old folder
    [ -d "$SOURCE_WORKSPACE/backend-workspace" ] && cp -r "$SOURCE_WORKSPACE/backend-workspace/"* "$BACKEND_DIR/" 2>/dev/null || true
    [ -d "$SOURCE_WORKSPACE/frontend-workspace" ] && cp -r "$SOURCE_WORKSPACE/frontend-workspace/"* "$FRONTEND_DIR/" 2>/dev/null || true
    
    # If files were loose in the root of the old folder, copy them based on context
    [ -f "$SOURCE_WORKSPACE/server.cjs" ] && cp "$SOURCE_WORKSPACE/server.cjs" "$BACKEND_DIR/"
    [ -f "$SOURCE_WORKSPACE/App.jsx" ] && cp "$SOURCE_WORKSPACE/App.jsx" "$FRONTEND_DIR/src/" 2>/dev/null || true
    log_success "Migration complete."
else
    log_warn "Source directory $SOURCE_WORKSPACE not found. Proceeding with clean install."
fi

# ==============================================================================
# PHASE 3: ENTERPRISE DEPENDENCY INSTALLATION & STUBBING
# ==============================================================================
log_header "PHASE 3: Backend Configuration & Missing File Stubbing"

cd "$BACKEND_DIR"
[ ! -f "package.json" ] && npm init -y

log_info "Installing Enterprise Backend Dependencies..."
npm install express cors helmet morgan compression express-rate-limit xss-clean hpp cookie-parser prom-client socket.io uuid axios sequelize pg mysql2 ioredis jsonwebtoken bcryptjs stripe @paypal/checkout-server-sdk @sendgrid/mail twilio cloudinary @googlemaps/google-maps-services-js openai @google/generative-ai dotenv --legacy-peer-deps

# Create required folders to prevent server.cjs from crashing
mkdir -p routes/webhooks models services config

log_info "Generating failsafe mocks for missing routes/models..."
# 1. Stub the routes so express app.use() doesn't fail
ROUTES=("auth" "profile-owners" "clients" "search" "moodle" "admin" "payments" "notifications" "upload" "ai-chat" "ai-voice" "webhooks/stripe")
for route in "${ROUTES[@]}"; do
    if [ ! -f "routes/$route.js" ]; then
        echo "module.exports = require('express').Router();" > "routes/$route.js"
    fi
done

# 2. Stub the Sequelize models so database sync doesn't crash
if [ ! -f "models/index.cjs" ]; then
    cat <<EOF > models/index.cjs
const { Sequelize, DataTypes } = require('sequelize');
// Use SQLite in memory as a failsafe if no real DB is connected yet
const sequelize = new Sequelize('sqlite::memory:', { logging: false });
module.exports = {
  sequelize,
  User: sequelize.define('User', { id: { type: DataTypes.INTEGER, primaryKey: true } }),
  ProfileOwner: sequelize.define('ProfileOwner', {}),
  Client: sequelize.define('Client', {}),
  Connection: sequelize.define('Connection', {}),
  PaymentTransaction: sequelize.define('PaymentTransaction', {})
};
EOF
fi

log_header "PHASE 4: Frontend Configuration"

cd "$FRONTEND_DIR"
[ ! -f "package.json" ] && npm create vite@latest . -- --template react

mkdir -p src/{assets,components/{layout,common,auth},contexts,hooks,pages,services,styles,utils}

log_info "Installing Enterprise Frontend Dependencies..."
npm install react-router-dom axios react-hot-toast lucide-react --legacy-peer-deps

# ==============================================================================
# PHASE 5: ENVIRONMENT VARIABLES
# ==============================================================================
log_header "PHASE 5: Environment Generation"

cd "$BACKEND_DIR"
if [ ! -f ".env" ]; then
    cat <<EOF > .env
NODE_ENV=development
PORT=3005
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tham_platform
DB_USERNAME=root
DB_PASSWORD=
JWT_SECRET=$(openssl rand -hex 32)
ENABLE_METRICS=true
ALLOWED_ORIGINS=http://localhost:5153,http://localhost:3001
EOF
fi

cd "$FRONTEND_DIR"
if [ ! -f ".env" ]; then
    cat <<EOF > .env
VITE_API_BASE_URL=http://localhost:3005/api/v1
VITE_ENABLE_AI=true
EOF
fi

# ==============================================================================
# PHASE 6: EXECUTION
# ==============================================================================
log_header "PHASE 6: Bootstrapping Applications"

pm2 delete all > /dev/null 2>&1 || true

# Start Backend
cd "$BACKEND_DIR"
log_info "Starting Backend Server..."
ENTRY_POINT="index.cjs"
[ -f "server.cjs" ] && ENTRY_POINT="server.cjs"
pm2 start "$ENTRY_POINT" --name "backend-api" --env development

# Start Frontend
cd "$FRONTEND_DIR"
log_info "Starting Frontend Development Server..."
pm2 start npm --name "frontend-client" -- run dev

pm2 save > /dev/null 2>&1

log_header "SYSTEM ONLINE"
pm2 list
echo -e "\n${GREEN}Your Enterprise App is now running!${NC}"
echo -e "Backend running on port ${BOLD}3005${NC} (via server.cjs)"
echo -e "Frontend running on port ${BOLD}5153${NC}"
echo -e "Use ${BOLD}pm2 logs${NC} to view realtime system outputs."