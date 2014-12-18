#!/bin/sh


file=$(node gh-pages.js)
path=$(dirname "$file")

firefox ${file}
sleep 3
echo "removing: ${path}"
rm -rf ${path}
