#!/bin/bash
cat src/environments/environment.prod.ts > src/environments/environment.ts
rm -fr www
ionic build --prod
firebase deploy
git checkout src/environments/environment.ts
