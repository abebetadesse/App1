#!/bin/bash
# fix-refs.sh - Safely add forwardRef to React components that need it
# Run from: /mnt/c/Users/abebe/Desktop/New folder/App1/frontend-workspace

set -e

FRONTEND_SRC="src"
BACKUP_DIR=".ref-fix-backup-$(date +%Y%m%d_%H%M%S)"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }

# Create backup
mkdir -p "$BACKUP_DIR"
cp -r "$FRONTEND_SRC" "$BACKUP_DIR/"
log_info "Backup created at $BACKUP_DIR"

# Process each .jsx file that exports a default function component
find "$FRONTEND_SRC" -name "*.jsx" -type f | while read file; do
    # Skip if already has forwardRef
    if grep -q "forwardRef" "$file"; then
        continue
    fi

    # Check if it's a functional component that might receive ref
    # Look for patterns like: export default function ComponentName
    # or: const ComponentName = (props) => { ... }; export default ComponentName;
    
    if grep -Pq "export default function [A-Z]\w+" "$file"; then
        component_name=$(grep -Po "export default function \K[A-Z]\w+" "$file" | head -1)
        
        if [ -n "$component_name" ]; then
            log_info "Fixing $file ($component_name)"
            
            # Create a temporary file
            temp_file=$(mktemp)
            
            # Add forwardRef import if not present
            if ! grep -q "import.*forwardRef.*from 'react'" "$file"; then
                # If file has 'import React from "react"'
                if grep -q 'import React from ["'\'']react["'\'']' "$file"; then
                    sed -i 's/import React from \(["'\''"]\)react\1/import React, { forwardRef } from \1react\1/' "$file"
                # If file has 'import { ... } from "react"'
                elif grep -q 'import {[^}]*} from ["'\'']react["'\'']' "$file"; then
                    sed -i 's/import {/import { forwardRef, /' "$file"
                else
                    # Add new import line at top
                    sed -i '1s/^/import React, { forwardRef } from "react";\n/' "$file"
                fi
            fi
            
            # Convert: export default function ComponentName(props) {
            # To: const ComponentName = forwardRef((props, ref) => {
            sed -i "s/export default function $component_name(props)/const $component_name = forwardRef((props, ref)/" "$file"
            
            # Convert: export default function ComponentName() {
            # To: const ComponentName = forwardRef((props, ref) => {
            sed -i "s/export default function $component_name()/const $component_name = forwardRef((props, ref)/" "$file"
            
            # Add displayName and export at the end of the file
            # Find the last closing brace of the component (simplified approach)
            # We'll append the displayName and export after the function body ends
            if ! grep -q "${component_name}.displayName" "$file"; then
                echo "" >> "$file"
                echo "${component_name}.displayName = '${component_name}';" >> "$file"
                echo "export default ${component_name};" >> "$file"
                
                # Remove the old export default line (now handled by separate export)
                sed -i "/^export default ${component_name};$/d" "$file" 2>/dev/null || true
            fi
            
            log_success "  Fixed $component_name in $file"
        fi
    
    # Handle pattern: const ComponentName = (props) => { ... }; export default ComponentName;
    elif grep -Pq "export default [A-Z]\w+;" "$file" && grep -q "const [A-Z]\w+ = (props)" "$file"; then
        component_name=$(grep -Po "export default \K[A-Z]\w+" "$file" | head -1)
        
        if [ -n "$component_name" ]; then
            log_info "Fixing $file ($component_name)"
            
            # Add forwardRef import
            if ! grep -q "forwardRef" "$file"; then
                if grep -q 'import React from ["'\''"]react["'\'']' "$file"; then
                    sed -i 's/import React from \(["'\''"]\)react\1/import React, { forwardRef } from \1react\1/' "$file"
                else
                    sed -i '1s/^/import React, { forwardRef } from "react";\n/' "$file"
                fi
            fi
            
            # Change: const ComponentName = (props) => {
            # To: const ComponentName = forwardRef((props, ref) => {
            sed -i "s/const $component_name = (props) =>/const $component_name = forwardRef((props, ref) =>/" "$file"
            sed -i "s/const $component_name = (props, [^)]*) =>/const $component_name = forwardRef((props, ref) =>/" "$file"
            
            # Add displayName before export
            if ! grep -q "${component_name}.displayName" "$file"; then
                sed -i "/export default $component_name;/i ${component_name}.displayName = '${component_name}';" "$file"
            fi
            
            log_success "  Fixed $component_name in $file"
        fi
    fi
done

log_success "Ref fixes applied."
echo ""
log_warning "If components behave unexpectedly, restore from backup:"
echo "  cp -r $BACKUP_DIR/src/* src/"