var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://admin:Artman09!@ds229468.mlab.com:29468/todo-app');

// mongoose.connect('mongodb://admin:Artman09!@ds229468.mlab.com:29468/todo-app');

// mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};

