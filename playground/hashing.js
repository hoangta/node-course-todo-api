const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')

var data = {
    id: 10
}
var token = jwt.sign(data, 'pppsecret')
console.log(token)

let decoded = jwt.verify(token, '2pppsecret')
console.log('decoded', decoded)
// var message = 'Hey hey heiii!'
// var hash = SHA256(message).toString()
//
// console.log(`Message: ${message}`)
// console.log(`Hash: ${hash}`)
//
// var data = {
//     id: 4
// }
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'secret').toString()
// }
// token.data.id = 5
// token.hash = SHA256(JSON.stringify(data)).toString()
// var resultHash = SHA256(JSON.stringify(token.data) + 'secret').toString()
// if (resultHash === token.hash) {
//     console.log('Can be trusted')
// }
// else {
//     console.log('Can NOT be trusted!')
// }
