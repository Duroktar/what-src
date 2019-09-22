#!/usr/bin/env sh

echo "Cloning LICENSE to @what-src packages"
git stash
git checkout gh-pages
ls .
cp -R ./packages/what-src-stats-frontend/public/ .
git checkout -
git stash pop
echo
