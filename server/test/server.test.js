const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('./../server')
const {User} = require('./../models/user')
const {Todo} = require('./../models/todo')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

describe('POST /todo', () => {
    it('should create a new todo', (finished) => {
        var text = 'Test todo text'
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if (err) {
                    return finished(err)
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    finished()
                }).catch((e) => finished(e))
            })
    })

    it('should not create a new todo with invalid data', (finished) => {
        request(app)
            .post('/todos')
            .send({text: ''})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return finished(err)
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2)
                    finished()
                }).catch((e) => finished(e))
            })
    })
})

describe('GET /todo', () => {
    it('should get all todos', (finished) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(finished)
    })
})

describe('GET /todo:id', () => {
    it('should return todo', (finished) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toEqual(todos[0].text)
            })
            .end(finished)
    })

    it('should return 404 if todo not found', (finished) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(finished)
    })

    it('should return 404 for non-object ids', (finished) => {
        request(app)
            .get('/todos/xyz')
            .expect(404)
            .end(finished)
    })
})

describe('DELETE /todo:id', () => {
    it('should delete todo', (finished) => {
        let id = todos[1]._id.toHexString()
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toEqual(id)
            })
            .end((err, res) => {
                if (err) {
                    return finished(err)
                }

                Todo.findById(id).then((todo) => {
                    expect(todo).toBeNull()
                    finished()
                }).catch((e) => finished(e))
            })
    })

    it('should return 404 if todo not found', (finished) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(finished)
    })

    it('should return 404 for non-object ids', (finished) => {
        request(app)
            .delete('/todos/xyz')
            .expect(404)
            .end(finished)
    })
})

describe('PATCH /todo:id', () => {
    it('should update todo', (finished) => {
        let id = todos[0]._id.toHexString()
        let newTodo = {
            text: 'First test todo updated',
            completed: true
        }
        request(app)
            .patch(`/todos/${id}`)
            .send(newTodo)
            .expect(200)
            .expect((res) => {
                console.log(res.body.text)
                expect(res.body.text).toEqual(newTodo.text)
                expect(res.body.completed).toBe(true)
                expect(typeof res.body.completedAt).toBe('number')
            })
            .end(finished)
    })

    it('should clear completedAt when todo is not completed', (finished) => {
        let id = todos[1]._id.toHexString()
        let newTodo = {
            text: 'Second test todo updated!',
            completed: false
        }
        request(app)
            .patch(`/todos/${id}`)
            .send(newTodo)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toEqual(newTodo.text)
                expect(res.body.completed).toBe(false)
                expect(res.body.completedAt).toBeNull()
            })
            .end(finished)
    })
})

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString())
                expect(res.body.email).toBe(users[0].email)
            })
            .end(done)
    })

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({})
            })
            .end(done)
    })
})

describe('POST /users', () => {
    it('should create a user', (done) => {
        let info = {
            email: 'anewuser@example.com',
            password: 'anewpassword'
        }
        request(app)
            .post('/users')
            .send(info)
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeDefined()
                expect(res.body._id).toBeDefined()
                expect(res.body.email).toBe(info.email)
            })
            .end((err) => {
                if (err) {
                    return done(err)
                }

                User.findOne({email: info.email}).then((user) => {
                    expect(user).toBeDefined()
                    expect(user.password).not.toBe(info.password)
                    done()
                }).catch((e) => done(e))
            })
    })

    it('should return validation errors if request invalid', (done) => {
        let info = {
            email: 'anemail',
            password: '123'
        }
        request(app)
            .post('/users')
            .send(info)
            .expect(400)
            .end(done)
    })

    it('should not create user if email in use', (done) => {
        request(app)
            .post('/users')
            .send(users[0])
            .expect(400)
            .end(done)
    })
})

describe('POST /users/login', () => {
    it('should login user and return token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeDefined()
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toHaveProperty('access', 'auth', 'token', res.headers['x-auth'])
                    done()
                }).catch((e) => done(e))
            })
    })

    it('should reject valid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].email
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).not.toBeDefined()
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(0)
                    done()
                }).catch((e) => done(e))
            })
    })
})

describe('DELETE /users/me/token', () => {
    it('should remove token on log out', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0)
                    done()
                }).catch((e) => done(e))
            })
    });
})
