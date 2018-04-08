const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        //validator
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: `{VALUE} is not an e-mail`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access},'abc123').toString();

    user.tokens = user.tokens.concat([{access, token}]);
    // user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    });
};

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch(e) {
        // return new promise ((resolve, reject) => {
        //     reject();
        // })
        return Promise.reject();
    }
    // console.log(User);
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    }); 
};

UserSchema.pre('save', function(next) {
    var user = this;

    if (user.isModified('password') ) {
        bcrypt.genSalt(10, (err, salt) => {
           bcrypt.hash(user.password, salt, (err, hash) => {
               user.password = hash;
               next();
           }) 
        });
    } else {
        next();
    }
});

var User = mongoose.model('User', UserSchema);

// var newUser = new User({
//     email: "123@123.com"
// });

// newUser.save().then((doc) => {
//     console.log('Saved User', JSON.stringify(doc, undefined, 1));
// }, (e) => {
//     console.log('Unable to save User', e);
// });

module.exports = {User};