'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var bodyParser = require('express')
const validUrl = require("valid-url");

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;
var ID = function () {
  return  Math.random().toString(36).substr(2, 9);
};

/** this project needs a db !! **/ 
mongoose.connect(process.env.DB_URI,{ useNewUrlParser: true, useUnifiedTopology: true });
console.log(mongoose.connection.readyState)


const { Schema } = mongoose;

var urlSchema = new Schema({
  hash:String,
  url: String,
  short_url: String,
})
const shortUrl = mongoose.model('shortUrl',urlSchema);




app.get("/api/shorturl/:hash", async (req, res) => {
  const urlCode = req.params.hash;
  console.log(urlCode)
  const item = await shortUrl.findOne({ hash: urlCode });
  if (item) {
    return res.redirect(item.url);
  } else {
    return res.json({"error":"invalid URL"})
  }
});


app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({extended: false}))

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post("/api/shorturl/new", function(req,res){
  const  original_url  = req.body.url;
  
      if (validUrl.isUri(original_url)) {
    } else {
      return res
        .status(401)
        .json(
          "Invalid Base Url"
        );
    }
  
  const hash = new shortUrl({url:req.body.url, hash:ID()})
  hash.save(function (err,data){console.log(data)
    if (err) console.log(err); 
  });
  res.json(hash)
})



app.listen(port, function () {
  console.log('Node.js listening ...');
});