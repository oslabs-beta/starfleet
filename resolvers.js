const Tour = require('./models/tourModel');

module.exports = resolvers = {
  Query: {
    tourModelById: async (_, id) => {
      const tour = await Tour.findById(id);
      return tour;
    } 
  }
};

