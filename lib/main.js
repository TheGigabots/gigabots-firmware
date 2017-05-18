"use strict";
require("babel-polyfill"); //Dont comment out or delete!
require('source-map-support').install();
const Brain = require('./Brain');
const brain = new Brain();
brain.init();
