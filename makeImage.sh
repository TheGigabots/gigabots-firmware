#!/usr/bin/env bash
## This is used along with the brickstrap docker container
## to build an image that is ready to burn and install.

npm install
npm run dist
docker rmi gigabot
docker build . -t gigabot
tools/brickstrap.sh create-tar gigabot gigabot-brain.tar
tools/brickstrap.sh create-image gigabot-brain.tar gigabot-brain.img
rm gigabot-brain.tar
zip gigabot-brain.zip gigabot-brain.img
rm gigabot-brain.img
