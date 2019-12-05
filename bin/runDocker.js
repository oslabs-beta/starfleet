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


module.exports = {
  build,
  up
}


