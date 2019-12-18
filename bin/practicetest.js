const exec = require('child_process').exec;
const shell = require('shelljs');
const find = require('find')
const fs = require('fs')
const createFileStructure = require('./createFileStructure');
const createDockerfile = require('./createDockerfile');
const createGeneratedServer = require('./createGeneratedServer');

createGeneratedServer('URL', 'starfleet')