var mongoose = require('mongoose');
var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        //validator
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedat: {
        type: Number,
        default: null
    }
});

// var newTodo = new Todo({
//     text: "this is a todo",
//     completed: false,
//     completedat: null
// });

// newTodo.save().then((doc) => {
//     console.log('Saved todo', JSON.stringify(doc, undefined, 2));
// }, (e) => {
//     console.log('Unable to save to do');
// });

module.exports = {Todo}