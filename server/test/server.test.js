const request = require('supertest')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')

const todos = [{
    text: 'First test todo'
}, {
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
