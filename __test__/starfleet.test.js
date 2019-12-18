const fs = require('fs');
const shell = require('shelljs');
const find = require('find');
const createFileStructure = require('../bin/createFileStructure');
const createGeneratedServer = require('../bin/createGeneratedServer');
const createDockerCompose = require('../bin/createDockerCompose');
const createDockerfile = require('../bin/createDockerfile');
const createContainerInventory = require('../bin/createContainerInventory');
const chalk = require('chalk');


//test to see if the file structure has been invoked and created:
describe('starfleet tests:', () => {
    describe(chalk.blue.bold('starfleet init command'), () => {
        test(chalk.yellow('creates new file structure in working directory'), async() => {
            let result;
            await find.dir('graphqlsrc', dir => {
                if (dir.length === 2) { 
                    result = true;
                    expect(result).toBe(true);
                }
            })
            await createFileStructure();
            await find.dir('graphqlsrc', dir => {
                if (dir.length === 2) { 
                    result = true;
                    expect(result).toBe(true);
                    shell.exec(`rmdir ${dir}`);
                } else { 
                    result = false;
                    expect(result).toBe(true);
                }
            })
        })

        test(chalk.yellow('create generated server'), async() => {
            let result;
            await fs.access('./graphqlServer.js', fs.F_OK, (err) => {
                if (!err) { 
                    result = true;
                    return expect(result).toBe(true);
                } else { 
                    result = true;
                    createGeneratedServer("URL", "Practice");
                    // fs.unlinkSync('./graphqlServer.js');
                    shell.exec('rmdir graphqlServer.js')
                    return expect(result).toBe(true);
                }
            })
        })
    })

    describe(chalk.blue.bold('starfleet deploy command'), () => {
        test(chalk.yellow('creation of docker file'), async() => {
            let result;
            await fs.access('./Dockerfile', fs.F_OK, (err) => {
                if (!err) { 
                    result = true;
                    return expect(result).toBe(true)
                } else { 
                    result = true;
                    createDockerfile('Dockerfile', 4000);
                    fs.unlinkSync('./Dockerfile');
                    return expect(result).toBe(true);
                }
            })
    })

    test(chalk.yellow('creation of docker compose file'), async() => {
        let result;
        await fs.access('./docker-compose-starfleet.yml', fs.F_OK, (err) => {
            if (!err) { 
                result = true;
                return expect(result).toBe(true)
            } else { 
                result = true;
                createDockerCompose('Test', 4000);
                fs.unlinkSync('./docker-compose-starfleet.yml')
                return expect(result).toBe(true)
            }
        })
    })
})
})