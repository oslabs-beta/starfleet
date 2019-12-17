const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const shell = require('shelljs');
const find = require('find');
const createFileStructure = require('../bin/createFileStructure');
const createGQL = require('../bin/createGQL');
const blogModel = require('./exampleSchema');
const createDockerCompose = require('../bin/createDockerCompose');
const createDockerfile = require('../bin/createDockerfile');
const chalk = require('chalk');


//test to see if the file structure has been invoked and created:
    describe(chalk.blue.bold('starfleet init command'), () => {
        it(chalk.yellow.bold('creates new file structure in working directory'), async() => {
            let result;
            await find.dir('graphqlsrc', dir => {
                if (dir.length === 3) { 
                    result = true;
                    expect(result).toBe(true);
                }
            })
            await createFileStructure();
            await find.dir('graphqlsrc', dir => {
                if (dir.length === 3) { 
                    result = true;
                    expect(result).toBe(true);
                    shell.exec(`rmdir ${dir}`);
                    shell.exec(`rmdir graphqlsrc`)
                } else { 
                    result = false;
                    expect(result).toBe(true);
                }
            })
        })

    //     test('creates graphGQL from mongoose schema and puts it into graphqlsrc/models folder', async() => {
    //         let result = false;
    //         await jest.fn(() => {
    //             createFileStructure();
    //             createGQL(blogModel, blog);
    //             find('/graphqlsrc/models', files => {
    //                 if (files.include('gql')) { 
    //                     result = true;
    //                 }
    //                 expect(result).toBe(true)
    //             })
    //         })
    //     })
    // })
        // it(chalk.yellow.bold('creates graphGQL from mongoose schema and puts it into graphsrc/models folder'), async() => {
        //     let result;
        //     await find.dir('graphqlsrc', dir => {
        //         if (dir.length === 3) { 
        //             createGQL(blogModel, 'blog');
        //             find('/graphqlsrc/models', files => {
        //                 if (files.includes())
        //             })
        //         }
        //     })
        // })

    // describe(chalk.blue.bold('starfleet deploy command'), () => {
    //     test('creation of docker file', async() => {
    //         let result = false;
    //         await jest.fn(() => {
    //             createDockerfile('ProjectNameExmaple', 4000);
    //             find.file('ProjectNameExmaple', file => {
    //                 if (file) {
    //                     result = true; 
    //                 }
    //                 expect(result).toBe(true)
    //             })
    //         })
    //     })

        it('creation of docker file', async() => {
            let result;
            await find.file('DockerFile', file => {
                if (file.length === 1) { 
                    result = true;
                    expect(result).toBe(true);
                }
            })
            await createDockerfile('DockerFile', 4000);
            await find.file('DockerFile', file => {
                if (file.length === 1) { 
                    result = true;
                    expect(result).toBe(true);
                    shell.exec(`rmdir ${file}`);
                } else { 
                    result = false;
                    expect(result).toBe(true);
                }
            })
        })

    //     test('creation of docker compose', async() => {
    //         await jest.fn (() => {
    //             let result = false;
    //             createDockerCompose('ProjectNameExmaple', 4000);
    //             find.file('ProjectNameExmaple', file => {
    //             if (file) { 
    //                 result = true;
    //                 expect(result).toBe(true);
    //             }
    //         })
    //     })
    // })
    })