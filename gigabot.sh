#!/usr/bin/env bash
export BOT_ENV=ev3
export BOT_LOGGING=prod
sudo -E node --max_old_space_size=96 --max-executable-size=64  dist/main.js

