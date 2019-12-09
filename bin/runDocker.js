const chalk = require('chalk');
const { exec, spawn} = require('child_process');

const build = () => {
  //const pwd =  spawnSync('pwd', { encoding: 'utf-8' });
  const options = {
	encoding: 'utf-8'
  };

  const newBuild = spawn('docker-compose', ['build'], options);
  newBuild.stdout.on('data', data => {
	console.log(`Building docker images: ${data}`);
  });

  newBuild.on('exit', (code, signal) => {
	console.log(chalk.green('✔'), 'Build process complete');
    console.log(chalk.cyan('--- Deploying fleet ---. Press'),chalk.yellow.bold('CTRL + C'),chalk.cyan.bold('to quit'));
  });
};

const up = () => {
  const options = {
	encoding: 'utf-8'
  };

  const newDeploy = spawn('docker-compose', ['up'], options);

  newDeploy.on('data', data => {
	console.log(`Deploying fleet: ${data}`);
  });

  newDeploy.on('exit', (code, signal) => {
	console.log('Deploy process terminated ' + `code ${code} and signal ${signal}`);
  });

};

const stop = containers => {
  if (!containers) return console.log('There are currently no Starfleet generated containers to stop');
  const options = {
	encoding: 'utf-8'
  }

  containers = containers.replace(/,/g, ' ');
  exec(`docker stop ${containers}`, {shell: '/bin/bash'}, console.log('Stopping Starfleet containers: ', containers));

  /*
  const args = ['stop', ...containers.split(' ')];
  console.log('Stopping containers: ', args);
  const newTerminator = spawn('docker', args, options);

  newTerminator.on('data', data => {
	console.log(`Stopping containers: ${data}`);
  });

  newTerminator.on('exit', (code, signal) => {
	console.log('Stopping containers exited with code ', code, 'and signal ', signal);
  });
  */

};


module.exports = {
  build,
  up,
  stop
}


