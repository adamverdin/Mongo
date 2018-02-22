
const {mongoose} = require('./../server/db/mongoose');
const {ObjectID} = require('mongodb')
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user')

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

Todo.findOneAndRemove({
    _id: '5a7ce320bb7801c1de42d9be',
}).then((todo) => {
    console.log(todo);
})

Todo.findByIdAndRemove('5a7ce320bb7801c1de42d9be').then((todo) => {
    console.log(todo);
})