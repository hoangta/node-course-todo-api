const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo'
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
                console.log(res.body)
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
