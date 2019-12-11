// Helper function used in starfleet.js; check subcommands sections of starfleet.js file
const fs = require('fs');
const shell = require('shelljs');
const chalk = require('chalk');

const createDockerCompose = (PROJECT_NAME, PORT) => {
  //console.log('Creating docker compose config file');

  const filePath = `${process.cwd()}/docker-compose.yml`;
  const text = 
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
  shell.touch(filePath);
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

  

	

