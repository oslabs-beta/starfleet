#!/usr/bin/env node
const fs = require('fs');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const schemaComposer = require('graphql-compose').schemaComposer;
const schemaFromUser = require(`../${process.argv[2]}`)
const printSchema = require('graphql').printSchema
const shell = require('shelljs'); // portable unix shell commands for node.js 
const path = require('path');
const inquirer = require("inquirer"); //a collection of common interactive command 
// const mongoose = require('mongoose');
const chalk = require("chalk"); //terminal string styling done right
const figlet = require("figlet"); // program for making large letters our of ordinary text

const init = () => {
    const questions = [{   
        name: "USERINPUT",
        message: "Please enter a name for your project: ",
        type: "input",
    },
    {
        name: "SCHEMALOCATION",
        message: "Where is your schema located?:",
        type: "input",
    },
    {
        name: "PORT",
        message: "Please choose a PORT: ",
        type: "number",
        default: 4000,
    }
    ];

    inquirer.prompt(questions)
    .then(answers => {
        const projectFile = `${process.cwd()}/${answers.USERINPUT}.js`
        const text = `FROM node: latest \n WORKDIR /usr/src/app/${answers.USERINPUT} \n COPY package.json /usr/src/app/${answers.USERINPUT}/  \n\n RUN npm install \n COPY . /usr/src/${answers.USERINPUT} \n EXPOSE ${answers.PORT} \n CMD npm start`;

        const userSchemaPath = path.resolve(__dirname, `${answers.SCHEMALOCATION}`)
        shell.touch(projectFile);
        for (let key in schemaFromUser) {
            if (key) {
                const composedSchema = composeWithMongoose(schemaFromUser[key])
                schemaComposer.Query.addFields({
                    userById: composedSchema.getResolver('findById'),
                    userByIds: composedSchema.getResolver('findByIds'),
                    userOne: composedSchema.getResolver('findOne'),
                    userMany: composedSchema.getResolver('findMany'),
                    userCount: composedSchema.getResolver('count'),
                    userConnection: composedSchema.getResolver('connection'),
                    userPagination: composedSchema.getResolver('pagination'),
                });
    
                schemaComposer.Mutation.addFields({
                    userCreateOne: composedSchema.getResolver('createOne'),
                    userCreateMany: composedSchema.getResolver('createMany'),
                    userUpdateById: composedSchema.getResolver('updateById'),
                    userUpdateOne: composedSchema.getResolver('updateOne'),
                    userUpdateMany: composedSchema.getResolver('updateMany'),
                    userRemoveById: composedSchema.getResolver('removeById'),
                    userRemoveOne: composedSchema.getResolver('removeOne'),
                    userRemoveMany: composedSchema.getResolver('removeMany'),
                });
                  
                const graphqlSchema = schemaComposer.buildSchema();
                const gqlFile = path.resolve(__dirname, userSchemaPath)
                fs.writeFileSync(gqlFile, printSchema(graphqlSchema))
            }
        }
    })
    .then(() => {
        console.log(chalk.white.bgGreen.bold(`Done! Your docker file has been created and put into your working directory!`))
    })
}

// const createGraphQLSchema = () => {
//     // const questions = [{   
//     //     name: "USERINPUT",
//     //     message: "Please enter a name for your project: ",
//     //     type: "input",
//     // },
//     // {
//     //     name: "PORT",
//     //     message: "Please choose a PORT: ",
//     //     type: "number",
//     //     default: 4000,
//     // }
//     // ];

//     inquirer.prompt(questions)
//     .then(answers => {
//         const newFile = `${process.cwd()}/${answers.USERINPUT}.js`
//         // const text = `FROM node: latest \n WORKDIR /usr/src/app/${answers.USERINPUT} \n COPY package.json /usr/src/app/${answers.USERINPUT}/  \n\n RUN npm install \n COPY . /usr/src/${answers.USERINPUT} \n EXPOSE ${answers.PORT} \n CMD npm start`;
//         shell.touch(newFile);
//         fs.writeFile(filePath, text, (err) => {
//             if (err) { 
//                 throw err;
//             }
//         })
//         return answers.USERINPUT;
//     })
//     .then(() => {
//         console.log(chalk.white.bgGreen.bold(`Done! Your docker file has been created and put into your working directory!`))
//     })
// }

const run = async() => {
    init();
    // createGraphQLSchema();
}

run();

