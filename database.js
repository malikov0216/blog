const config = require('./config');
const mongoose = require('mongoose');

module.exports = () => {
  return new Promise((reslove, reject) => {
    mongoose.Promise = global.Promise;
    mongoose.set('debug', true);

    mongoose.connection
      .on('error', error => reject(error))
      .on('close', () => console.log('Database connection closed.'))
      .once('open', () => reslove(mongoose.connection));

    mongoose.connect(
      config.MONGO_URL,
      { useMongoClient: true }
    );
  });
};
