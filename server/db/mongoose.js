var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let db = {
    localhost: 'mongodb://localhost:27017/TodoApp',
    mlab: 'mongodb://<dbuser>:<dbpassword>@ds229468.mlab.com:29468/todo-app'
  };

mongoose.connect(db.localhost || db.mlab);

module.exports = {mongoose};