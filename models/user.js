const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        require: true,
        minLength: 3,
        maxLength: 30,
        unique: true,
    },
    email: {
        type: String,
        require: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    }, //String Hasher
    birthDay:{
        type: String,
        require: true,
    },
    role: {
        type: [String]
    },
    esportRole: {
        type: [String]
    },
    profile: {
        picture: {
            type: String,
            default: "",
        },
        bio: {
            type: String,
            maxLength: 1024,
        },
        followers: {
            type: [String]
        },
        following: {
            type: [String]
        },
        likes: {
            type: [String]
        },
    },
},
{
    timestamps: true,
}
)

const UserModel = mongoose.model('user', userSchema)

module.exports = UserModel