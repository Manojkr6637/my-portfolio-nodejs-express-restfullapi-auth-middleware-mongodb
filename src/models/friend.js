const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Connected!'));
const modelName = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password is invalid');
            }
        }
    },
    age: {
        type: String,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be greater than zero')
            }
        }
    }
})
const Friend = mongoose.model('Friend', modelName);
module.exports = Friend