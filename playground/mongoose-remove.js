const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

// var id = '5b7a5c76db49d69fff35834411'
// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid')
// }
//
Todo.deleteMany({}).then((results) => {
    console.log('Results', results)
})

Todo.findOneAndRemove({
    _id: id
}).then((todo) => {
    console.log('Todo', todo)
})

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found!')
//     }
//     console.log('Todo by Id', todo)
// }).catch((e) => console.log('e'))

// var id = '5b79a3f12b4f118ac8c489ad'
//
// User.findById(id).then((user) => {
//     if (!user) {
//         return console.log('User not found!')
//     }
//     console.log('User by Id', user)
// }).catch((e) => console.log(e))
