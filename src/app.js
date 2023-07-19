const path = require('path');
const express = require('express');
const app = express();
const hbs = require('hbs');


const publicDirectory = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
//     console.log(req.method, req.path)
//     if (req.method === 'GET') {
//         res.send('GET method is disabled');
//     } else {
//         next();
//     }

// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently unavailable. Check back sonn');
// })

const router = new express.Router();
router.get('/test', function(req, res) {
    res.send({
        title: 'Test Router',
    })
})
app.use(router);
app.set('view engine', 'hbs');
const uuid = require('uuid');

const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicDirectory));

app.use(express.json());
// Routers
const SkillRouter = require('./routers/skills');
const friendRouter = require('./routers/friend');
const teamRouter = require('./routers/team');
const userRouter = require('./routers/user');
const TaskRouter = require('./routers/task');
app.use(SkillRouter);
app.use(friendRouter);
app.use(teamRouter);
app.use(userRouter);
app.use(TaskRouter);
let datas = [{
    uuid: uuid.v4(),
    title: "Stock Market",
    description: "Stock Market description",
    createdon: new Date().getDay() + '-' + new Date().getMonth() + '-' + new Date().getFullYear(),
    updatedon: new Date().getDay() + '-' + new Date().getMonth() + '-' + new Date().getFullYear()
}]
app.get('/', (req, res) => {
    res.render('index', {
        name: "My Investment",
        isRecod: datas.length > 0 ? true : false,
        datas: datas
    })
})
app.get('/portfolio', (req, res) => {
    res.render('portfolio', {
        name: "Home page"
    })
})

app.get('/investment', (req, res) => {
    res.render('portfolio', {
        name: "Home page"
    })
})
app.get('/add', (req, res) => {
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
        res.render('index', {
            name: "My Investment",
            isRecod: datas.length > 0 ? true : false,
            datas: datas
        })
    } else {
        res.render('add-investment', {
            name: "Add page"
        })
    }

})
app.get('/edit/:uuid', (req, res) => {
    const uuid = req.params.uuid
    const title = req.query.title
    const detail = datas.filter((item) => item.uuid == uuid);

    if (title) {
        const title = req.query.title
        const description = req.query.description
        const newDatas = datas.map((item) => {
            if (item.uuid == detail[0].uuid) {
                item.title = title;
                item.description = description;
            }
            return item;
        })
        res.render('index', {
            name: "My Investment",
            isRecod: newDatas.length > 0 ? true : false,
            datas: newDatas
        })
    } else {
        res.render('edit-investment', {
            name: uuid + " Not Matched",
            uuid: uuid,
            title: detail[0].title,
            description: detail[0].description,
        })
    }

})
app.get('/delete/:uuid', (req, res) => {
    const uuid = req.params.uuid
        // datas = datas.filter((item) => item.uuid != uuid);
        // console.log(uuid)
        // res.render('index', {
        //     name: "My Investment",
        //     isRecod: newDatas.length > 0 ? true : false,
        //     datas: newDatas
        // })
    if (uuid) {

    }
    res.redirect('/');


})
app.get('/office-work', (req, res) => {
    res.send({
        name: "Home page"
    })
})
app.get('/document', (req, res) => {
    res.send({
        name: "Home page"
    })
})
app.get('/document', (req, res) => {
    res.send({
        name: "Home page"
    })
})
app.get('/document', (req, res) => {
    res.send({
        name: "Home page"
    })
})

app.listen(port, (req, res) => {
    console.log(" listening on port " + port)
})

const Task = require("./models/task");
const User = require("./models/user");
const main = async() => {

    const user = await User.findById('649d61be121da2c3e3906e81').exec();
    // await task.populate('owner').execPopulate();
    // await task.populate('owner').exec();
    // await user.populate('tasks').execPopulate(); not working
    // console.log(user.tasks);
}
main();