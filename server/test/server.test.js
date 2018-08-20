const request = require('supertest')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')

beforeEach((finished) => {
    Todo.remove({}).then(() => finished())
})

describe('POST /todo', () => {
    it('should create a new todo', (finished) => {
        var text = 'Test todo text'
        request(app)
            .post('/todos')
            .send({text})
            .then
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if (err) {
                    return finished(err)
                }

                Todo.find().then((todos) => {
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
                    expect(todos.length).toBe(0)
                    finished()
                }).catch((e) => finished(e))
            })
    })
})
