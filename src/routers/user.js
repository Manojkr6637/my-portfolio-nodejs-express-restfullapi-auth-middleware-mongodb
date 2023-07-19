const express = require('express');
const router = new express.Router();
const User = require('./../models/user')
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const multer = require('multer');
const storage = multer.memoryStorage()
const sharp = require('sharp');
const upload = multer({
    storage: storage,
    dest: 'images',
    limits: {
        fileSize: 100000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload  PDF')); //
        }
        cb(undefined, true)
    }

})
router.get('/users', auth, async function(req, res) {
    // const token = jwt.sign({ _id: 'abc123' }, 'Thisiskey', { expiresIn: '7 days' });

    // const ver = jwt.verify(token, 'Thisiskey');
    // console.log(token, ver);
    const users = await User.find({})
    res.send(users);
})
router.get('/user/me', auth, async function(req, res) {
    res.send(req.user);
})
router.get('/user/:id', auth, async function(req, res) {
    const id = req.params.id
    const friend = await User.find({ _id: id });
    res.send(friend);
})

router.get('/user/page/test', async function(req, res) {
    const user = await User.
    findOne({ name: 'Sobhan Kumari' }).
    populate({ options: { limit: 2 } }).
    exec();

    res.send(user);
})


router.post('/user', async(req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateToken();
        res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send(err)
    }

})
router.post('/user/login', async(req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const user = await User.findByCredentials(email, password)
            // console.log(user)
        const token = await user.generateToken();
        // console.log(token)
        res.send({ user: user.getPublicProfile(), token });
    } catch (err) {
        res.status(400).send(err)
    }

})
router.post('/user/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save();
        res.send("Logout successful");
    } catch (err) {
        res.status(401).send(err)
    }
})
router.post('/user/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save();
        res.send("Logout successful");
    } catch (err) {
        res.status(501).send(err)
    }
})
router.put('/user/:id', async(req, res) => {

    const id = req.params.id
    const user = await User.updateOne({ _id: id }, req.body);
    res.send(user);

})
router.patch('/user/:id', async(req, res) => {

    const id = req.params.id
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'mobile'];
    const isValid = updates.every((updates) => allowedUpdates.includes(updates))
    if (!isValid) {
        return res.status(400).send({ error: 'Invalid' });
    }
    const user = await User.findByIdAndUpdate(id, req.body);
    if (!user) {
        res.status(404).send(user);
    }
    res.send(user);

})
router.delete('/user/:id', async(req, res) => {
    const id = req.params.id
    const user = await User.deleteOne({ _id: id });
    res.send(user);
})
router.delete('/user/delete', auth, async(req, res) => {
        try {
            const user = await User.findByIdAndDelete({ _id: req.user._id });
            res.send(user);
            //     await req.user.remove();
        } catch (err) {
            res.status(500).send(err);
        }
    })
    // const errorMiddleware = (req, res, next) => {
    //     throw new Error('From my middleware')
    // }
router.post('/user/me/avatar', auth, upload.single('avatar'), async(req, res) => {

    const buffer = await sharp(req.file.buffer)
        .resize(320, 240).resize({
            width: 250,
            height: 250
        }).png().toBuffer();


    req.user.avatar = buffer
    await req.user.save()
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

router.delete('/user/me/avatar/delete', auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send();
})
router.get('/user/:id/avatar', async(req, res) => {
    try {
        console.log(req.params.id)
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error('Not found')
        }
        console.log("useruser", process.env.SALT_KEY)
        res.set('content-type', 'image/png');
        res.send(user.avatar);

    } catch (err) {
        res.status(500).send({
            error: err
        })
    }
});
module.exports = router