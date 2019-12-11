const fs = require('fs');

const createContainerInventory = name => {


  const stream = fs.createWriteStream('inventory.txt', {flags: 'a'});
  stream.write(name);
  stream.end();


}

module.exports = createContainerInventory;
