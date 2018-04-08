var expect = require('expect');
var request = require('supertest');
const {
    todos, users,
    populateTodos, 
    populateUsers
} = require('./seed/seed')

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
const {User} = require('./../models/user');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({})
            })
            .end(done);
    });
});

describe('POST /users', (done) => {
    it('should create a user', (done) => {
        var email = 'example@example.com';
        var password = '123abc!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                })
            });

    });
    it('should return validation errors if request is invalid', (done) => {
        //send across invalid e-mail and password
        //fails with 400
        var email = "1234"
        var password = "123"
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done)
    });
    it('should not create user if email in use', (done) => {
        //send across existing e-mail and password
        //fails with 400
        var email = users[0].email;
        var password = "123Abc";
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
})