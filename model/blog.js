require("../utils/config");
const mongoose = require("mongoose");
const url = process.env.MONGO_URI;
mongoose.connect(url);
console.log("Connecting to", url);
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

module.exports = mongoose.model("Blog", blogSchema);
