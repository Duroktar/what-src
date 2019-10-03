#!/usr/bin/env sh

# If you see this error VvV
#
# @what-src/stats-frontend: ERROR in ../what-src-utils/dist/index.js
# @what-src/stats-frontend: Module not found: Error: Can't resolve '@what-src/runtime-cache' in '/Users/duroktar/what-src-plugin-repo/packages/what-src-utils/dist'
# @what-src/stats-frontend:  @ ../what-src-utils/dist/index.js 3:0-34
# @what-src/stats-frontend:  @ ./src/stitch.ts
# @what-src/stats-frontend:  @ ./src/main.tsx
#
# ----------------------------------------------------------------------
#
# Then run this script...
# It's available in the main package.json scripts as `npm run fix:stats`.
#

bold=$(tput bold)
normal=$(tput sgr0)

src=/packages/what-src-stats-frontend/node_modules/@what-src
dest=/packages/what-src-stats-frontend/node_modules/@what-src/utils/node_modules/@what-src

echo "[1/1] 🔗  Linking ${bold}$src ${normal}to ${bold}$dest"
ln -s $(pwd)$src $(pwd)$dest
