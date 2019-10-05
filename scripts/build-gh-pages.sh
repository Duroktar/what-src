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

echo "[1/9] 🔥  Cleaning up old builds..."
npm run clean:gh-pages >> logs/gh-pages.build.log

echo "[2/9] 👕  Running linter..."
npm run lint >> logs/gh-pages.build.log

echo "[3/9] 🚨  Running tests..."
npm run test >> logs/gh-pages.build.log

echo "[4/9] 👷  Building webapp..."
lerna run build:stats >> logs/gh-pages.build.log

echo "[5/9] 🎭  Building example..."
npm run build:example >> logs/gh-pages.build.log

echo "[6/9] 🚚  Copying webpapp to gh-pages folder..."
npm run copy:stats >> logs/gh-pages.build.log

echo "[7/9] 🚚  Copying example to gh-pages folder..."
npm run copy:example >> logs/gh-pages.build.log

echo "[8/9] 📚  Generating documentation..."
npm run build:docs >> logs/gh-pages.build.log

echo "[9/9] 🐈  A cat."
