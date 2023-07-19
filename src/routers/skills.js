const express = require('express');
const router = new express.Router();
const uuid = require('uuid');
const { insertOne, insertMany, find, findOne, updateOne, deleteOne } = require('./../mongodb')
let datas = [];
router.get('/skill', async function(req, res) {
    datas = await find();
    res.render('skill/index', {
        name: "Skills",
        isRecod: datas.length > 0 ? true : false,
        datas: datas
    })
})
router.get('/skill/add', async(req, res) => {
    const title = req.query.title
    const description = req.query.description

    if (title) {
        const ob = {
            uuid: uuid.v4(),
            title: title,
            description: description,
            createdon: new Date().getDay() + '-' + new Date().getMonth() + '-' + new Date().getFullYear(),
            updatedon: new Date().getDay() + '-' + new Date().getMonth() + '-' + new Date().getFullYear()
        }
        datas.unshift(ob);
        await insertOne(ob)
            // insertMany(ob)
            // datas = await find();
        res.render('skill/index', {
            name: "My Skill",
            isRecod: datas.length > 0 ? true : false,
            datas: datas
        })
    } else {
        res.render('skill/add', {
            name: "Add page"
        })
    }

})
router.get('/skill/edit/:uuid', async(req, res) => {
    const uuid = req.params.uuid
    const title = req.query.title
    const detail = await findOne(uuid);
    console.log("detaildetail", detail)
    if (title) {

        const description = req.query.description
        const ob = {
            title: title,
            description: description
        }
        const newDatas = await updateOne(uuid, ob);

        // res.render('skill/index', {
        //     name: "My Skill",
        //     isRecod: newDatas.length > 0 ? true : false,
        //     datas: newDatas
        // })
        res.redirect('/skill');
    } else {
        res.render('skill/edit', {
            name: uuid + " Not Matched",
            uuid: uuid,
            title: detail.length ? detail[0].title : '',
            description: detail.length ? detail[0].description : ''
        })
    }

})
router.get('/skill/delete', async(req, res) => {
    const uuid = req.query.uuid

    if (uuid) {
        const newDatas = await deleteOne(uuid);
    }
    res.redirect('/skill');
})

module.exports = router