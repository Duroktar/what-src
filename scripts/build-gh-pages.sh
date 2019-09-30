#!/usr/bin/env bash

set -e

mkdir -p logs

clear

npm run logo
npm run logo >> logs/gh-pages.build.log
echo >> logs/gh-pages.build.log
echo ''
echo '          Build Log' >> logs/gh-pages.build.log
echo '          Project Build'
echo ''
echo >> logs/gh-pages.build.log

# emoji scheme inspired by https://gist.github.com/parmentf/035de27d6ed1dce0b36a

echo "[1/7] 🔥  Cleaning up old builds..."
npm run clean:gh-pages >> logs/gh-pages.build.log
echo "[2/7] 👕  Linting..."
npm run lint >> logs/gh-pages.build.log
echo "[3/7] 🚨  Running tests..."
npm run test >> logs/gh-pages.build.log
echo "[4/7] 👷  Building Webapp..."
lerna run build:stats >> logs/gh-pages.build.log
echo "[5/7] 📚  Building documentation..."
npm run build:docs >> logs/gh-pages.build.log
echo "[6/7] 🚚  Copying webpapp to gh-pages folder..."
echo "[7/7] 🐈  A cat."
npm run copy:stats >> logs/gh-pages.build.log
