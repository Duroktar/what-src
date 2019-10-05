#!/usr/bin/env sh

[ -d docs/example ] || mkdir docs/example

echo "[1/3] 🚚  Copying html from packages/what-src-example-typescript-loader/public/*.html to docs/example/ .."
cp -R ./packages/what-src-example-typescript-loader/public/*.html ./docs/example/

echo "[2/3] 🚚  Copying sources from packages/what-src-example-typescript-loader/public/*.js to docs/ .."
cp -R ./packages/what-src-example-typescript-loader/public/*.js ./docs/

echo "[3/3] 🚚  Copying images from packages/what-src-example-typescript-loader/public/*.jpeg to docs/ .."
cp -R ./packages/what-src-example-typescript-loader/public/*.jpeg ./docs/
