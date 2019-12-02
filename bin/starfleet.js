#!/usr/bin/env node

const fs = require('fs');
// const mongoose = require('mongoose');

const init = () => {
    let fileName = process.argv[2]; // process.argv is an array that stores all user specified inputs following the starfleet command
    fs.readFile(fileName, "utf8", (err, data) => {
        if (err) throw err;
        console.log(fileName);
        console.log(data);
    })
}

const run = async() => {
    init();
}

run();
