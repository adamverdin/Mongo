require('./config/config.js');
const express = require('express');
const bodyParser = require('body-parser')
const _ = require('lodash');
const {
    ObjectID
} = require('mongodb');

var {
    mongoose
} = require('./db/mongoose.js');
var {
    Todo
} = require('./models/todo');
var {
    User
} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');
var app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        });
    }, (e) => {
        res.status(404).send(e);
    });
});


//fetch query string in api url

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    //es.send(req.params);
    //validate id using isValid
    // if (!ObjectID.isValid(id)) {
    // console.log("ID is not valid");
    // };
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    };

    //if Invalid respond with 404-send back empty body
    //find by id
    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        } else {
            res.send({
                todo
            });
        }
    }).catch((e) => {
        res.status(404).send();
    });
    //success
    //if todo there -> send back
    //if no to do -> send back 404 w/ empty body.
    //error
    //400 -> and send empty boy back
});


app.delete('/todos/:id', (req, res) => {
//get id
    var id = req.params.id;
//validate id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    };
//remove todo by id
    Todo.findByIdAndRemove(id).then((todo) => {

        // res.send({todo});
        if (!todo) {
            return res.status(404).send();
        } else {
            res.send({todo});
        }
    }).catch((e) => {
        res.status(404).send();
    });
    //success
        //if no doc send 404
    //err
        //send 404
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e);
    })
});


//users




app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then((user) => {
        return user.generateAuthToken(); 
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.listen(port, () => {
    console.log(`Started up at ${port}`)
});



app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
}); 

module.exports = {
    app
};