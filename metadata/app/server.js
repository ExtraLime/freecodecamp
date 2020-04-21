'use strict';

var express = require('express');
var cors = require('cors');
var bodyParser = require('express');
var morgan =  require('morgan')
var multer = require('multer')

// require and use "multer"...

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));



app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});


var upload = multer({ dest: 'uploads/' })

app.post('/api/fileanalyse', upload.single('upfile'), async (req, res) => {
  if (!req.file) {
    console.log("No file received");
    return res.send({
      success: false
    });

  } else {
    console.log('file received')
    console.log(req.file);
    return res.send({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size
    })
  }
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
