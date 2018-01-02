"use strict";

/*** THESE ARE RUNTIMES THAT ARE USED BY SCRIPTING ***/
/*** DONT COMMENT OUT :)                           ***/
require("babel-polyfill"); //Dont comment out or delete!
require('regenerator-runtime') //Don't comment out or delete!
/// Source map support
require('source-map-support').install();

const Brain = require('./Brain');
const brain = new Brain();
brain.init( process.argv.length === 3 && process.argv[2] === '--shell' )



