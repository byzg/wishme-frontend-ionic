#!/bin/bash
git branch -D deploy
git checkout -b deploy
cat src/environments/environment.prod.ts > src/environments/environment.ts
rm -fr www
ionic build --prod
firebase deploy
git add .
git commit -m "deploy"
git checkout master
