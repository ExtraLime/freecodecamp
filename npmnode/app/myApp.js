
var bodyParser = require('express')
var express = require('express');
var app = express();

// --> 7)  Mount the Logger middleware here
app.use(bodyParser.urlencoded({extend: false}))
app.use(express.static(__dirname + "/public"))
app.use(function middlewear(req, res, next){
        var string = req.method + " " + req.path + " - " + req.ip;; 
        console.log(string);
        next()
  })
app.post("/name", (req,res) => {
  var { first: firstName, last:lastName } = req.body;
  
  res.json({name: `${firstName} ${lastName}`});
});
app.get("/name", (req,res) => {
  var { first: firstName, last:lastName } = req.query;
  
  res.json({name: `${firstName} ${lastName}`});
});


app.get('/now', function(req,res,next){
  req.time = new Date().toString();
  next();
}, function(req,res){res.json({time:req.time})
})

app.get('/:word/echo',(req,res) => {
  const {word} = req.params;
  res.json({echo:word})
        
        })
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/views/index.html" )})
// --> 11)  Mount the body-parser middleware  here
app.get('/json', (req, res) => {
  if (process.env.MESSAGE_STYLE==='uppercase') {
  res.json({"message":"Hello json".toUpperCase()})};
  res.json({"message":"Hello json"})})

/** 1) Meet the node console. */


/** 2) A first working Express Server */


/** 3) Serve an HTML file */


/** 4) Serve static assets  */


/** 5) serve JSON on a specific route */


/** 6) Use the .env file to configure the app */
 
 
/** 7) Root-level Middleware - A logger */
//  place it before all the routes !


/** 8) Chaining middleware. A Time server */


/** 9)  Get input from client - Route parameters */


/** 10) Get input from client - Query parameters */
// /name?first=<firstname>&last=<lastname>

  
/** 11) Get ready for POST Requests - the `body-parser` */
// place it before all the routes !


/** 12) Get data form POST  */

console.log('Hello World')

// This would be part of the basic setup of an Express app
// but to allow FCC to run tests, the server is already active
/** app.listen(process.env.PORT || 3000 ); */

//---------- DO NOT EDIT BELOW THIS LINE --------------------

 module.exports = app;
