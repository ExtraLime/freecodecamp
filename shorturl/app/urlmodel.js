const mongoose = require("mongoose");
const { Schema } = mongoose;

var urlSchema = new Schema({
  hash:String,
  url: String,
  short_url: String,
})
const shortUrl = mongoose.model('shortUrl',urlSchema);