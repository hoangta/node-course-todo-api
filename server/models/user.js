const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email!'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
})

UserSchema.methods.toJSON = function() {
    return _.pick(this.toObject(), ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = function() {
    let user = this
    let access = 'auth'
    let token = jwt.sign({_id: this._id.toHexString(), access}, 'pppsecret')
    user.tokens.push({access, token})
    return user.save().then(() => {
        return token
    })
}

var User = mongoose.model('User', UserSchema)

module.exports = {User}
