const express = require('express');
const router = new express.Router();
const Team = require('./../models/team')
let datas = [];
router.get('/team', async function(req, res) {
    const team = await Team.find({})
    res.send(team);
})

router.get('/team/:id', async function(req, res) {
    const id = req.params.id
    const team = await Team.find({ _id: id });
    res.send(team);
})
router.post('/team', async(req, res) => {

    const fr = new Team(req.body);
    fr.save().then((rd) => {
        res.send(rd)
    }).catch(err => {
        res.status(400).send(err)
        console.log(err);
    })
})
router.put('/team/:id', async(req, res) => {

    const id = req.params.id
    const team = await Team.updateOne({ _id: id }, req.body);
    res.send(team);

})
router.delete('/team/:id', async(req, res) => {
    const id = req.params.id
    const team = await Team.deleteOne({ _id: id });
    res.send(team);
})

module.exports = router