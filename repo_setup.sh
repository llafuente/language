#!/bin/sh

# setup history

git clone git@github.com:llafuente/language.git
cd language/
git checkout --orphan documentation
echo "node_modules" > .gitignore
vi .gitignore
npm init
npm install marked --save
git add .gitignore
git add package.json
git commit -m "setup documentation"

vi gh-pages.js
vi readme.markdown
node gh-pages.js
git add gh-pages.js
git add readme.markdown
git commit -m "readme & parser"

git checkout --orphan gh-pages
bower init
bower install --save github-markdown-css
git rm --cached gh-pages.js
git rm --cached package.json
git rm --cached readme.markdown
git add bower.json
git add bower_components/
git commit -m "gh-pages setup"

git checkout --orphan master
git rm --cached -r bower_components
git rm --cached bower.json
git commit -m "setup master"

git push --all origin

#clean up
rm bower.json
rm gh-pages.js
rm package.json
rm readme.markdown

# now you can move freely
