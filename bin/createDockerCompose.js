// Helper function used in starfleet.js; check subcommands sections of starfleet.js file
const fs = require('fs'); // node file system
const shell = require('shelljs'); // Unix shell commands for Node.js
const chalk = require('chalk'); // Terminal string styling

const createDockerCompose = (PROJECT_NAME, PORT) => { 

  const filePath = `${process.cwd()}/docker-compose-starfleet.yml`; // create this file
  const text = // with this text being written
`version: "2"
services:
  app:
    container_name: ${PROJECT_NAME}
    restart: always
    build: .
    ports:
      - "${PORT}:${PORT}"
    links:
      - mongo

  mongo:
    container_name: mongo
    image: mongo
    volumes:
      - ./data:/data/db
    ports:
      - "27017:27017"

  admin-mongo:
    image: 0x59/admin-mongo:latest
    ports:
      - "8082:8082"
    environment:
      - PORT=8082
      - CONN_NAME=mongo
      - DB_HOST=mongo
    links:
      - mongo
  `
  shell.touch(filePath); // this method will create file with filepath variable
  fs.writeFile(filePath, text, err => { 
	if (err) {
	  console.log(chalk.red.bold('Error creating docker-compose.yml'));
	  throw err;
	}
	return;
  });
  
  console.log(chalk.green('✔'),chalk.cyan.bold('Done! Your docker-compose.yml file has been created and put into your working directory!'));
};

module.exports = createDockerCompose;

  

	

