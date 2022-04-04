const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email:String, 
    password:String, //String Hasher
    userName:String, 
    birthDay:String,
})

const UserModel = mongoose.model('user', userSchema)

module.exports = UserModel