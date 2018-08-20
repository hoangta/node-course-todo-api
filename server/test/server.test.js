const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 123
}]

beforeEach((finished) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => finished())
})

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
                expect(res.body.text).toEqual(newTodo.text)
                expect(res.body.completed).toBe(true)
                expect(typeof res.body.completedAt).toBe('number')
            })
            .end(finished)
    })

    it('should clear completedAt when todo is not completed', (finished) => {
        let id = todos[1]._id.toHexString()
        let newTodo = {
            text: 'Second test todo updated',
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
