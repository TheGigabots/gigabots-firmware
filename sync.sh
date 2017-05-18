#!/usr/bin/env bash
npm run dist
rsync -avz   \
--include '*.js' \
--include '*.map' \
--include '*.pbm' \
--include 'assets/' \
--include 'dist/' \
--include 'script/' \
--exclude '*' \
--exclude '*.config.js' \
. robot@ev3dev:/home/robot/
