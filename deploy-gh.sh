#!/bin/bash
git branch -D gh-pages
git push origin --delete gh-pages
git checkout -b gh-pages
cat src/environments/environment.prod.ts > src/environments/environment.ts
ionic cordova build browser --prod
find . -type d ! -path './www*' ! -path './node_modules*' ! -path './platforms*' ! -path './.git*' ! -path '.' | xargs rm -rf
rm -r  *.*
mv platforms/browser/* .
git add .
git commit -m "Publishing to github pages"
git push origin gh-pages
git checkout master
