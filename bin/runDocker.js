const chalk = require('chalk');
const { exec, spawn} = require('child_process');

const build = () => {
  //const pwd =  spawnSync('pwd', { encoding: 'utf-8' });
  const options = {
	encoding: 'utf-8'
  };

  const newBuild = spawn('docker-compose', ['-f','docker-compose-starfleet.yml','build'], options);
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

  const newDeploy = spawn('docker-compose', ['-f','docker-compose-starfleet.yml','up','-d'], options);

  newDeploy.on('data', data => {
	console.log(`Deploying fleet: ${data}`);
  });

  newDeploy.on('exit', (code, signal) => {
	console.log('Deploy process status ' + `code ${code} and signal ${signal}`);
  });

};

const stop = () => {
  console.log('Stopping Starfleet containers')
  exec(`docker-compose -f docker-compose-starfleet.yml down`, {shell: '/bin/bash'}, (err, stdout, stderr) => {
	if (err) console.log('Error stopping containers: ', err);
	console.log('Successfully landed')
  });
};


module.exports = {
  build,
  up,
  stop
}


