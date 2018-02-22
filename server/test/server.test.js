
var expect = require('expect');
var request = require('supertest');
const _ = require('lodash');
const {
    ObjectID
} = require('mongodb');
const {
    app
} = require('./../server');
const {
    Todo
} = require('./../models/todo');

const todos = [{
        _id: new ObjectID(),
        text: "First test todo"
    },
    {
        _id: new ObjectID(),
        text: "Second test todo",
        completed: true,
        completedAt: 333
    }
];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done())
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Text todo text';

        request(app)
            .post('/todos')
            .send({
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.find({
                    text
                }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            })
    });

    it('should not create todo with invalid body data', (done => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    //expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            })
    }))
})
debugger;

describe('GET /todos', () => {

    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });

});

describe('Get /todos/:id', () => {
    it('should get the todo', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return a 404 error if todo not found', (done) => {
        var falseId = new ObjectID;
        request(app)
            .get(`/todos/${falseId.toHexString()}`)
            .expect(404)
            .end(done)
    });

    it('should return 404 for non-object IDs', (done) => {
        request(app) // todoes/123
            .get('/todos/123')
            .expect(404)
            .end(done)
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            })

    });

    it('should return 404 if todo not found', (done) => {
        var falseId = new ObjectID;
        request(app)
            .delete(`/todos/${falseId.toHexString()}`)
            .expect(404)
            .end(done)
    });

    it('should return 404 if object id is not found', (done) => {
        request(app) // todoes/123
            .delete('/todos/123')
            .expect(404)
            // .expect((res) => {
            //     expect(res.body.todo._id).toBe(hexId);
            // })
            .end(done)
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        var text = "Updated via API";
        //grab id of first item
        request(app)
            // .get(`/todos/${hexId}`)
            .patch(`/todos/${hexId}`)
            .send({
                completed: true,
                text,
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done)
        //update text, set completed true
        //200
        //text is changed, completed is true
    });

    it('should clear completedAt when todo is not completed', (done) => {
        //grab id of second todo item
        var hexId = todos[1]._id.toHexString();
        //update text, set completed to false
        var text = "Updated via API";
        //200
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                text,
                completed: false
            })
            .expect(200)
            //text
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done)
        //text is changed, completed false, completedAt is null .toNotExist
    });

})