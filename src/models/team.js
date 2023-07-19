const mongoose = require('mongoose');
const validator = require('validator');
mongoose.connect('mongodb://127.0.0.1:27017/my-portfolio-db').then(() => console.log('Connected!'));

const Schema = mongoose.Schema;
const modelName = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Enter a valid email address')
            }

        }
    },
    designation: {
        type: String,
        required: true,
        trim: true

    }

})
const Team = mongoose.model('team', modelName);
module.exports = Team