#!/usr/bin/env sh

echo "[what-src] 🔨  Cloning LICENSE to @what-src packages..."
cat LICENSE
ls -db ./packages/*/ | egrep -v '.*packages\/(what-src-testing-flatris)\/?$' | xargs -n 1 cp LICENSE
