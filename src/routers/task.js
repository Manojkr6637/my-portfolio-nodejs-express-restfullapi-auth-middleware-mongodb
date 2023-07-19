const express = require('express');
const router = new express.Router();
const Task = require('../models/task')
const auth = require('../middleware/auth');
router.get('/tasks', auth, async function(req, res) {
    const tasks = await Task.find({})
    res.send(tasks);
})
router.get('/task/me', auth, async function(req, res) {
    res.send(req.user);
})



router.post('/task/add', auth, async(req, res) => {
    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        });
        // console.log(task)
        await task.save();
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send(err)
    }

})

module.exports = router