const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')

const {Todo} = require('./../../models/todo')
const {User} = require('./../../models/user')

const userOneID = new ObjectID()
const userTwoID = new ObjectID()

const users = [{
    _id: userOneID,
    email: 'phongp@example.com',
    password: 'myOnePassword',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneID, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoID,
    email: 'hoang@example.com',
    password: 'myTwoPassword',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoID, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}]

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneID
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 123,
    _creator: userTwoID
}]

const populateTodos = (finished) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => finished())
}

const populateUsers = (finished) => {
    User.remove({}).then(() => {
        let user1 = new User(users[0]).save()
        let user2 = new User(users[1]).save()
        return Promise.all([user1, user2])
    }).then(() => finished())
}

module.exports = {todos, populateTodos, users, populateUsers}
