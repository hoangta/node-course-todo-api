const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

let password = 'pppassword'

bcrypt.genSalt(13, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash)
    })
})

let hashed = '$2a$13$XqoOZ3jMkXjm8uQsWspM0OEvmJidHDmBhnedsZsIjJmaawBEvo/pi'
bcrypt.compare('sss', hashed, (err, res) => {
    console.log(res)
})

// var data = {
//     id: 10
// }
// var token = jwt.sign(data, 'pppsecret')
// console.log(token)
//
// let decoded = jwt.verify(token, '2pppsecret')
// console.log('decoded', decoded)
