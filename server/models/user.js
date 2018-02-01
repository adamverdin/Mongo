var mongoose = require('mongoose');
var User = mongoose.model('User', {
    email: {
        type: String,
        //validator
        required: true,
        minlength: 1,
        trim: true
    }
});

// var newUser = new User({
//     email: "123@123.com"
// });

// newUser.save().then((doc) => {
//     console.log('Saved User', JSON.stringify(doc, undefined, 1));
// }, (e) => {
//     console.log('Unable to save User', e);
// });

module.exports = {User};