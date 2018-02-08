
const {mongoose} = require('./../server/db/mongoose');
const {ObjectID} = require('mongodb')
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
// var id = '5a75d29861bae7e4136664ef';

// if (!ObjectID.isValid(id)) {
//     console.log("ID is not valid");
// };


// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => { 
//     if(!todo){
//     return console.log("ID not found");
//     }
//     else {
//     console.log('Todo by Id', todo)
//     }
// }).catch((e) => console.log(e));;
var userID = '5a72f6dac37ebb7ae5c9315a';
User.findById(userID).then((user) => { 
    if(!user){
    return console.log("ID not found for User");
    }
    else {
    console.log(JSON.stringify(user, undefined, 2));
    }
}).catch((e) => console.log(e));;