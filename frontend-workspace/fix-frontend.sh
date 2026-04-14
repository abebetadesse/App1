#!/bin/bash

# ==============================================================================
# MISSING DEPENDENCY INSTALLER
# Description: Installs specific packages imported by your migrated React files
# that were missing from the initial setup payload.
# ==============================================================================

set -e

# --- Path Resolution (using lowercase 'app1' based on your error log) ---
if grep -qE "(Microsoft|WSL)" /proc/version 2>/dev/null; then
    FRONTEND_DIR="/mnt/c/Users/abebe/Desktop/New folder/app1/frontend-workspace"
elif [[ "$(uname -s)" == MINGW* ]] || [[ "$(uname -s)" == CYGWIN* ]]; then
    FRONTEND_DIR="/c/Users/abebe/Desktop/New folder/app1/frontend-workspace"
else
    FRONTEND_DIR="$HOME/Desktop/New folder/app1/frontend-workspace"
fi

echo "Working in Frontend Directory: $FRONTEND_DIR"
cd "$FRONTEND_DIR"

echo "Installing missing frontend dependencies..."
# Installing the specific packages Vite is asking for, plus core bootstrap
npm install react-bootstrap bootstrap react-feather socket.io-client --legacy-peer-deps

echo -e "\n✅ Missing dependencies installed successfully!"
echo "Please run 'npm run dev' to start Vite again."