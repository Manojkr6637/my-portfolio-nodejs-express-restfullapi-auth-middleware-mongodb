const express = require('express');
const router = new express.Router();
// const uuid = require('uuid'); 
// const friend = require('./../models/Friend');
const Friend = require('../models/friend')
let datas = [];
router.get('/friend', async function(req, res) {
    // datas = await find();
    // res.render('friend/index', {
    //     name: "Friend",
    //     isRecod: datas.length > 0 ? true : false,
    //     datas: datas
    // })
    const friend = await Friend.find({})
    res.send(friend);
})

router.get('/friend/:id', async function(req, res) {
    // datas = await find();
    // res.render('friend/index', {
    //     name: "Friend",
    //     isRecod: datas.length > 0 ? true : false,
    //     datas: datas
    // })
    const id = req.params.id
    const friend = await Friend.find({ _id: id });
    res.send(friend);
})
router.post('/friend', async(req, res) => {
    // const name = req.query.name

    // if (name) {
    //     const email = req.query.email
    //     const mobile = req.query.mobile
    //     const address = req.query.address
    //     const ob = {
    //             uuid: uuid.v4(),
    //             email: email,
    //             mobile: mobile,
    //             address: address,
    //             createdon: new Date().getDay() + '-' + new Date().getMonth() + '-' + new Date().getFullYear(),
    //             updatedon: new Date().getDay() + '-' + new Date().getMonth() + '-' + new Date().getFullYear()
    //         }
    // await insertOne(ob)
    // console.log("=================", req.body)
    // res.send(req);

    const fr = new Friend(req.body);
    fr.save().then((rd) => {
            console.log('insert frendi')
            res.send(rd)
        }).catch(err => {
            res.status(400).send(err)
            console.log(err);
        })
        // res.render('friend/index', {
        //     name: "My Friends",
        //     isRecod: datas.length > 0 ? true : false,
        //     datas: datas
        // })
        // } else {
        //     res.render('friend/add', {
        //         name: "Add friend"
        //     })
        // }

})
router.put('/friend/:id', async(req, res) => {

    const id = req.params.id
    const friend = await Friend.updateOne({ _id: id }, req.body);
    res.send(friend);

})
router.delete('/friend/:id', async(req, res) => {
    const id = req.params.id
    const friend = await Friend.deleteOne({ _id: id });
    res.send(friend);
})

module.exports = router