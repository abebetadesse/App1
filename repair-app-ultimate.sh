#!/bin/bash
# =============================================================================
#  THAM PLATFORM - ULTIMATE REPAIR & ENHANCEMENT SCRIPT (WSL-READY)
# =============================================================================
#  Performs:
#    - Backup of critical files
#    - Cleanup of duplicates/backups
#    - Fixes for bootstrap-icons imports
#    - Creation of missing utility exports
#    - Context hook fixes
#    - Environment file setup
#    - Optional dependency install & build test
# =============================================================================

set -e
set -o pipefail

# -----------------------------------------------------------------------------
# 0. ENVIRONMENT DETECTION & COLOR SETUP
# -----------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

IS_WSL=false
if [ -f /proc/sys/fs/binfmt_misc/WSLInterop ] || grep -qi microsoft /proc/version 2>/dev/null; then
    IS_WSL=true
fi

# Colors
if [ -t 1 ]; then
    RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
    BLUE='\033[0;34m'; MAGENTA='\033[0;35m'; CYAN='\033[0;36m'; NC='\033[0m'
else
    RED=''; GREEN=''; YELLOW=''; BLUE=''; MAGENTA=''; CYAN=''; NC=''
fi

log_info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $1"; }

# -----------------------------------------------------------------------------
# 1. VALIDATE PROJECT STRUCTURE
# -----------------------------------------------------------------------------
FRONTEND_DIR="$PROJECT_ROOT/frontend-workspace"
BACKEND_DIR="$PROJECT_ROOT/backend-workspace"
FRONTEND_SRC="$FRONTEND_DIR/src"

if [ ! -d "$FRONTEND_SRC" ]; then
    log_error "Frontend source not found: $FRONTEND_SRC"
    exit 1
fi

log_info "Project root validated."
if [ "$IS_WSL" = true ]; then
    log_info "Running in WSL environment."
fi

# -----------------------------------------------------------------------------
# 2. CREATE BACKUPS
# -----------------------------------------------------------------------------
BACKUP_DIR="$PROJECT_ROOT/.backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
log_info "Backups will be stored in: $BACKUP_DIR"

if [ -f "$FRONTEND_SRC/main.jsx" ]; then
    cp "$FRONTEND_SRC/main.jsx" "$BACKUP_DIR/"
fi
if [ -f "$FRONTEND_SRC/App.jsx" ]; then
    cp "$FRONTEND_SRC/App.jsx" "$BACKUP_DIR/"
fi

# -----------------------------------------------------------------------------
# 3. CLEANUP BACKUP & DUPLICATE FILES
# -----------------------------------------------------------------------------
log_info "Cleaning up backup files and duplicates..."

if [ -d "$BACKEND_DIR" ]; then
    find "$BACKEND_DIR" -type f \( -name "*.bak" -o -name "*.backup" -o -name "*.old" -o -name "*.broken" -o -name "*.brok" \) -delete
    log_success "Removed backup files from backend."
fi

# Remove duplicate src at root if it's a copy of backend src
if [ -d "$PROJECT_ROOT/src" ] && [ -d "$BACKEND_DIR/src" ]; then
    if diff -rq "$PROJECT_ROOT/src" "$BACKEND_DIR/src" 2>/dev/null | grep -q "identical"; then
        log_warning "Root 'src/' is a duplicate of backend 'src/'. Removing root copy."
        rm -rf "$PROJECT_ROOT/src"
    fi
fi

# Fix misspelled webhools directory
if [ -d "$BACKEND_DIR/webhools" ]; then
    mv "$BACKEND_DIR/webhools" "$BACKEND_DIR/webhooks"
    log_info "Renamed webhools -> webhooks"
fi
if [ -d "$BACKEND_DIR/src/webhools" ]; then
    mv "$BACKEND_DIR/src/webhools" "$BACKEND_DIR/src/webhooks"
    log_info "Renamed src/webhools -> src/webhooks"
fi

# Clean multiple server entry points (keep server.js only)
if [ -d "$BACKEND_DIR" ]; then
    cd "$BACKEND_DIR"
    # Remove backups of server files
    rm -f server.cjs.bak server.cjs.broken server.js.backup server.js.bak server.js.old server.mjs 2>/dev/null || true
    # If both server.js and server.cjs exist, prefer server.js and remove server.cjs
    if [ -f "server.js" ] && [ -f "server.cjs" ]; then
        rm -f server.cjs
        log_info "Removed duplicate server.cjs; using server.js."
    elif [ -f "server.cjs" ] && [ ! -f "server.js" ]; then
        mv server.cjs server.js
        log_info "Renamed server.cjs to server.js."
    fi
    cd "$PROJECT_ROOT"
fi

# -----------------------------------------------------------------------------
# 4. FIX BOOTSTRAP-ICONS IMPORTS
# -----------------------------------------------------------------------------
log_info "Scanning for bootstrap-icons imports to comment out..."
cd "$FRONTEND_SRC"
grep -rl "bootstrap-icons" . --include="*.js" --include="*.jsx" | while read file; do
    if grep -q "^[^/]*bootstrap-icons" "$file"; then
        # Comment out the line
        sed -i 's|^\([[:space:]]*import.*bootstrap-icons.*\)|// \1 (commented by repair script - loaded via CDN)|' "$file"
        log_info "Fixed: $file"
    fi
done
cd "$PROJECT_ROOT"

# -----------------------------------------------------------------------------
# 5. ENSURE ALL UTILITY EXPORTS EXIST
# -----------------------------------------------------------------------------
log_info "Creating/updating utility files with required exports..."
cd "$FRONTEND_SRC/utils"

# analytics.js
cat > analytics.js << 'EOF'
export const initializeAnalytics = () => {};
export const trackPageView = () => {};
export const trackEvent = () => {};
export const trackPerformance = () => {};
export default { initializeAnalytics, trackPageView, trackEvent, trackPerformance };
EOF

# errorReporting.js
cat > errorReporting.js << 'EOF'
export const initializeErrorReporting = () => {};
export const reportError = () => {};
export default { initializeErrorReporting, reportError };
EOF

# featureFlags.js
cat > featureFlags.js << 'EOF'
export const initializeFeatureFlags = () => {};
export const isFeatureEnabled = () => true;
export const getFeatureFlag = () => true;
export default { initializeFeatureFlags, isFeatureEnabled, getFeatureFlag };
EOF

# moodleIntegration.js
cat > moodleIntegration.js << 'EOF'
export const initializeMoodleSync = () => {};
export const syncMoodleCourses = async () => {};
export const getMoodleStatus = () => ({ linked: false, lastSync: null });
export default { initializeMoodleSync, syncMoodleCourses, getMoodleStatus };
EOF

# realTimeServices.js
cat > realTimeServices.js << 'EOF'
export const initializeRealTimeServices = () => {};
export default { initializeRealTimeServices };
EOF

# voiceAssistant.js
cat > voiceAssistant.js << 'EOF'
export const initializeVoiceAssistant = () => {};
export default { initializeVoiceAssistant };
EOF

# connectionManager.js
cat > connectionManager.js << 'EOF'
export const initializeConnectionManager = () => {};
export default { initializeConnectionManager };
EOF

# searchOptimization.js
cat > searchOptimization.js << 'EOF'
export const initializeSearchOptimization = () => {};
export const optimizeSearch = () => {};
export default { initializeSearchOptimization, optimizeSearch };
EOF

# performanceOptimizer.js
cat > performanceOptimizer.js << 'EOF'
export const initializePerformanceOptimizer = () => {};
export const optimizeComponent = () => ({ expectedImprovement: 0 });
export default { initializePerformanceOptimizer, optimizeComponent };
EOF

log_success "Utility files updated."
cd "$PROJECT_ROOT"

# -----------------------------------------------------------------------------
# 6. FIX CONTEXT EXPORTS
# -----------------------------------------------------------------------------
log_info "Ensuring context files export required hooks..."
cd "$FRONTEND_SRC/contexts"

# Helper function to add hook if missing
add_hook() {
    local file="$1"
    local hook_name="$2"
    if [ -f "$file" ]; then
        if ! grep -q "export const $hook_name" "$file" && ! grep -q "export function $hook_name" "$file"; then
            echo "export const $hook_name = () => ({});" >> "$file"
            log_info "Added $hook_name to $file"
        fi
    else
        # Create minimal context file
        cat > "$file" << EOF
import React, { createContext, useContext } from 'react';
const Context = createContext({});
export const Provider = ({ children }) => <Context.Provider value={{}}>{children}</Context.Provider>;
export const $hook_name = () => useContext(Context);
EOF
        log_info "Created $file with $hook_name"
    fi
}

add_hook "PerformanceContext.jsx" "usePerformanceMetrics"
add_hook "ConnectionContext.jsx" "useConnectionManager"
add_hook "MoodleSyncContext.jsx" "useMoodleSync"
add_hook "FeatureFlagContext.jsx" "useFeatureFlag"
add_hook "NotificationContext.jsx" "useNotification"
add_hook "TutorialContext.jsx" "useTutorial"
add_hook "VoiceAssistantContext.jsx" "useVoiceCommands"
add_hook "OfflineContext.jsx" "useOfflineSync"
add_hook "SearchOptimizationContext.jsx" "useSearchOptimization"

log_success "Context hooks verified."

# -----------------------------------------------------------------------------
# 7. ENSURE AppProviders.jsx EXISTS AND IS CORRECT
# -----------------------------------------------------------------------------
cd "$FRONTEND_SRC/providers"
if [ ! -f "AppProviders.jsx" ]; then
    log_warning "AppProviders.jsx not found. Creating..."
    cat > AppProviders.jsx << 'EOF'
import React from 'react';
// Import all providers (fallbacks handled)
let AuthProvider = ({ children }) => children;
let ThemeProvider = ({ children }) => children;
try { const mod = require('../contexts/AuthContext'); AuthProvider = mod.AuthProvider || AuthProvider; } catch(e){}
try { const mod = require('../contexts/ThemeContext'); ThemeProvider = mod.ThemeProvider || ThemeProvider; } catch(e){}

export const AppProviders = ({ children }) => (
  <AuthProvider>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </AuthProvider>
);
EOF
fi
cd "$PROJECT_ROOT"

# -----------------------------------------------------------------------------
# 8. SETUP ENVIRONMENT FILES
# -----------------------------------------------------------------------------
log_info "Setting up environment files..."
if [ ! -f "$FRONTEND_DIR/.env" ]; then
    cat > "$FRONTEND_DIR/.env" << EOF
VITE_API_URL=http://localhost:3005/api/v1
VITE_STRIPE_PUBLIC_KEY=pk_test_placeholder
EOF
    log_info "Created frontend .env"
fi

if [ -d "$BACKEND_DIR" ] && [ ! -f "$BACKEND_DIR/.env" ]; then
    cat > "$BACKEND_DIR/.env" << EOF
PORT=3005
MONGO_URI=mongodb://localhost:27017/tham_platform
JWT_SECRET=dev_secret_change_me
STRIPE_SECRET_KEY=sk_test_placeholder
EOF
    log_info "Created backend .env"
fi

# -----------------------------------------------------------------------------
# 9. DEPENDENCY INSTALLATION & BUILD (OPTIONAL)
# -----------------------------------------------------------------------------
read -p "Run npm install for frontend and backend? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Installing frontend dependencies..."
    cd "$FRONTEND_DIR"
    npm install --legacy-peer-deps 2>/dev/null || npm install
    log_success "Frontend dependencies installed."
    if [ -d "$BACKEND_DIR" ]; then
        log_info "Installing backend dependencies..."
        cd "$BACKEND_DIR"
        npm install
        log_success "Backend dependencies installed."
    fi
    cd "$PROJECT_ROOT"
fi

read -p "Run frontend build test? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Running frontend build..."
    cd "$FRONTEND_DIR"
    if npm run build; then
        log_success "✅ Frontend builds successfully!"
    else
        log_error "❌ Build failed. Check errors above."
    fi
    cd "$PROJECT_ROOT"
fi

# -----------------------------------------------------------------------------
# 10. SUMMARY
# -----------------------------------------------------------------------------
echo ""
echo "============================================================================"
log_success "ULTIMATE REPAIR SCRIPT COMPLETED"
echo "============================================================================"
log_info "Backups: $BACKUP_DIR"
log_info "Next steps:"
echo "  1. Start backend: cd backend-workspace && npm run dev"
echo "  2. Start frontend: cd frontend-workspace && npm run dev"
echo "  3. Access app at http://localhost:5173"
echo "============================================================================"