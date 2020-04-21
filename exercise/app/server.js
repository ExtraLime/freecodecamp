'use strict';
var express = require('express');
var mongo = require('mongodb');
const mongoose = require('mongoose');


var bodyParser = require('express')
const validUrl = require("valid-url");

const cors = require('cors')
var port = process.env.PORT || 3000;
var ID = function () {
  return  Math.random().toString(36).substr(2, 9);
};
mongoose.connect(process.env.DB_URI,{ useNewUrlParser: true, useUnifiedTopology: true });
console.log(mongoose.connection.readyState)

const app = express()
const { Schema } = mongoose;

var userSchema = new Schema({
  username:String,
  _id: String,
  count: Number,
  log: [Object]
})
const User = mongoose.model('User',userSchema);

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/exercise/new-user",async (req, res) => {
  const username = req.body.username;
  
  const status = await User.findOne({username: username});
  
  if (status){ 
     
    res.json({error:'This User Name Already Exists' })}
  
  const newUser = new User({username: username, _id:ID(),count:0})
  newUser.save(function(err, data){
    
    if (err) return console.log(err);
  })
  res.json({_id: newUser._id, username:newUser.username})
});

app.get("/api/exercise/users", async (req, res) => {
  const all_users = await User.find({},{username:1,_id:1});
  res.send(all_users)
})

app.post('/api/exercise/add',async (req,res) => {
  const {userId, description, duration} = req.body;
  const user = await User.findById({_id:userId})
  var date = new Date(req.body.date)
  if (date == 'Invalid Date') {date = new Date()}
    User.findById({_id:userId}, function(err,data){
      data.log.push({description:description,
                     duration:duration,
                     date:date})
      data.count = user.count + 1;
      data.markModified('log');
      data.markModified('count');
      data.markModified('log');
      data.save(function (err,data){
        if (err) return console.log(err);
        
      });
    });

  const rtn = {username:user.username,
              description:description,
               duration:Number(duration),
              _id:userId,
              date: date}
  res.json(rtn)
  });

app.get('/api/exercise/log', async (req,res) =>{
        const { userId, from, to, limit} = req.query;
  
  const userData = await User.find({_id:userId})
  
  const lg = userData[0].log
  const ed = new Date(to)
  const sd = new Date(from)
      
  if (from && to){
    var result = lg.filter(d => {var time = d.date;
                             return (time >= sd && time <= ed);
                            })}result = lg;
  if (limit){result = result.slice(0,parseInt(limit))};
  
  const resp = {id:userId, username:userData[0].username,count:userData[0].count,log:result};
  res.json(resp)

})

















// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
