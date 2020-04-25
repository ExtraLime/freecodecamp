/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
    MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        expect(err, 'database error').to.not.exist;
      var collection = db.collection('books');
      collection.find().toArray(function(err, result) {
        for (var i=0 ; i<result.length; i++) {
          result[i].commentcount = result[i].comments.legnth ; 
          delete result[i].comments;
        }console.log(result)
        res.json(result);
      })
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
  })
    .post(function (req, res){
    console.log(req.body.title)
      var title = req.body.title;
    if (!title) {console.log('missing')
      res.send('missing title')
    } else {
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db){
        var collection = db.collection('books');
        var doc = {title:title, comments:[]};
        collection.insert(doc, {w:1}, function(err, result){
          res.json(result.ops[0])
        })
      })
    }
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err,db){
        var collection = db.collection('books');
        collection.remove();
        res.send("all books deleted")
      })
    //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      
      var oid = new ObjectId(bookid);
    MongoClient.connect(MONGODB_CONNECTION_STRING, function(err,db){
      var collection = db.collection('books');
      collection.find({_id:oid}).toArray(function(err, result) {
        if (result.length === 0){
          res.send('book not found');
        }else {res.json(result[0])}
      })
    })
      
    //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var oid = ObjectId(bookid)
      var comment = req.body.comment;
    MongoClient.connect(MONGODB_CONNECTION_STRING, function(err,db){
      var collection = db.collection('books');
      collection.findAndModify(
      {_id:oid},
      {},
      {$push: {comments:comment}},
      {new:true, upsert: false},
      function(err, result){
        console.log(result.value)
        res.json(result.value)
        
      })
    })
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      var oid = new ObjectId(bookid);
    MongoClient.connect(MONGODB_CONNECTION_STRING, function(err,db){
      var collection = db.collection('books');
      collection.findOneAndDelete({_id:oid}, function(err, result){
        res.send("book deleted")
      })
    })
      //if successful response will be 'delete successful'
    });
  
};
