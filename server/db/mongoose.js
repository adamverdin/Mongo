var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect( process.env.PORT ? 'mongodb://apverdin:Artman09!@ds229468.mlab.com:29468/todo-app' : 'mongodb://localhost:27017/TodoApp');

// mongoose.connect('mongodb://apverdin:Artman09!@ds229468.mlab.com:29468/todo-app');

module.exports = {mongoose};

//mongoose.connect('mongodb://localhost:27017/TodoApp');
