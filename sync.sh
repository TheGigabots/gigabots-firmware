#!/usr/bin/env bash
npm run dist
rsync -avz   \
--include '*.js' \
--include '*.sh' \
--include '*.py' \
--include '*.map' \
--include '*.pbm' \
--include 'assets/' \
--include 'dist/' \
--include 'script/' \
--include 'tools/' \
--exclude '*' \
--exclude '*.config.js' \
. robot@ev3dev:/home/robot/
