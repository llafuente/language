#!/bin/sh


file=$(node gh-pages.js)
path=$(dirname "$file")

firefox ${file}
wait 5
echo "removing: ${path}"
rm -rf ${path}
