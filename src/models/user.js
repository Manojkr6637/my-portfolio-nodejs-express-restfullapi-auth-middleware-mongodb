const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
mongoose.connect('mongodb://127.0.0.1:27017/my-portfolio-db')
    .then(() => console.log('Connected!'));
const modelName = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
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
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password is invalid');
            }
        }
    },
    mobile: {
        type: Number,
        default: 0
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],

})
modelName.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner',
})
modelName.methods.getPublicProfile = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
}
modelName.methods.generateToken = async function() {
    const user = this
    const token = jwt.sign({
        _id: user.id.toString()
    }, process.env.SALT_KEY)
    user.tokens = user.tokens.concat({ token })
    await user.save();
    return token;

}
modelName.statics.findByCredentials = async(email, password) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user;
}
modelName.pre('save', async function(next) {
    // console.log("users======");
    let users = this;
    // console.log("users======", users);
    if (users.isModified('password')) {
        users.password = await bcrypt.hash(users.password, 8);
    }

    next();

});
const Task = require('./../models/task')
modelName.pre('remove', async function(next) {
    let user = this
    await Task.deleteMany({ 'User': user._id });
    next();

})

const User = mongoose.model('users', modelName);
module.exports = User