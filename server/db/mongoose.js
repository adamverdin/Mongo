var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds229468.mlab.com:29468/todo-app');

module.exports = {mongoose};