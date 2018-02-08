var express = require('express');
var bodyParser = require('body-parser')
const {
    ObjectID
} = require('mongodb')

var {
    mongoose
} = require('./db/mongoose.js');
var {
    Todo
} = require('./models/todo');
var {
    User
} = require('./models/user');

var app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

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
        res.statusCode(404).send();
    });
    //success
    //if todo there -> send back
    //if no to do -> send back 404 w/ empty body.
    //error
    //400 -> and send empty boy back
});

app.listen(port, () => {
    console.log(`Started up at ${port}`)
})

module.exports = {
    app
}