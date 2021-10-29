const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const hash = require('object-hash')
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

var users = []
var exercises = []

app.post('/api/users', (req, res) => {
    let n = req.body.username
    let id = hash(n)
    let userObject = {
        "_id": id,
        "username": n
    }
    users.push(userObject)
    res.json(userObject)
});

app.get('/api/users', (req, res) => {
    res.send(users)
});

app.get('/api/users/:_id/logs', (req, res) => {
    let id = req.params._id;
    let user = users.findIndex(x => x["_id"] == id);
    let userObject = users[user];
    let fromDate = new Date(Date.parse(req.query.from));
    let toDate = new Date(Date.parse(req.query.to));
    let limit = parseInt(req.query.limit);
    let logArr = new Array;
    for (i = 0; i < exercises.length; i++) {
      let exercise = exercises[i]
      if (exercise._id == id) {
            logArr = [...logArr, exercise]
        }
    }
    if (limit) {
    for (i = 0; i < (logArr.length - limit); i++) {
      logArr.pop()
    }
    }
    

    let response = { ...userObject, count: logArr.length, log: logArr }
    console.log(response)
    res.send(response)
});

app.post('/api/users/:_id/exercises', (req, res) => {
    let id = req.params._id
    let desc = req.body.description
    let dura = parseInt(req.body.duration)
    let date = new Date(Date.parse(req.body.date)).toDateString()
    let today = new Date().toDateString()
    let user = users.findIndex(x => x["_id"] == id)
    let userObject = users[user]
    let exerciseObject = {
        "_id": id,
        "username": users[user]["username"],
        "description": desc,
        "duration": dura,
        "date": date
    }
    exerciseObject.date == "Invalid Date" ? exerciseObject.date = today : false
    exerciseObject.date == "" ? exerciseObject.date = today : false
    exercises.push(exerciseObject)
    let output = { ...userObject, ...exerciseObject }
    res.json(output)
});



const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})