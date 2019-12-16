const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const shell = require('shelljs');
const find = require('find');
const createFileStructure = require('../bin/createFileStructure');
const createGQL = require('../bin/createGQL');
const blogModel = require('./exampleSchema');


//test to see if the file structure has been invoked and created:
    describe('starfleet init', () => {

        test('creates new file structure in working directory', async() => {
            let result = false;
            await jest.fn(() => {
                createFileStructure();
                find.dir('graphqlsrc', function(dir) {
                    if (dir.length === 3) { 
                        result = true
                    }
                    expect(result).toBe(true)
                })
            })
        })

        test('creates graphGQL from mongoose schema and puts it into graphqlsrc/models folder', async() => {
            let result = false;
            await jest.fn(() => {
                createFileStructure();
                createGQL(blogModel, blog);
                find('/graphqlsrc/models', files => {
                    if (files.include('gql')) { 
                        result = true;
                    }
                    expect(result).toBe(true)
                })
            })
        })
    })

    // describe('starfleet deploy command')