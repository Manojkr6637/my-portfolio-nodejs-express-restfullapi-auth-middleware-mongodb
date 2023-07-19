const jwt = require('jsonwebtoken');
const User = require('./../models/user');

const auth = async(req, res, next) => {
    try {
        // console.log('Auth middleware user==1', req.header('Authorization'))
        const token = req.header('Authorization').replace('Bearer ', '');
        // console.log('Auth middleware user==1', token)
        const decoded = jwt.verify(token, process.env.SALT_KEY)
            // console.log('Auth middleware user==1')
        const user = await User.findOne({
                _id: decoded._id,
                'tokens.token': token
            })
            // console.log('Auth middleware user==', user, decoded._id, token)
        if (!user) throw new Error(' Not valid user')
        req.token = token
        req.user = user
            // console.log('Auth middleware user==', req.user)
        next();
    } catch (err) {
        res.status(401).send({ error: 'Please authenticate' })
    }
}
module.exports = auth;