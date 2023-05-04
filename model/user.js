require("../utils/config");
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const url =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;
mongoose.connect(url);
console.log("Connecting to", url);
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: [3, "Username must be at least three characters"],
    unique: true,
  },
  name: String,
  passwordHash: {
    type: String,
    required: true,
  },
});
userSchema.plugin(uniqueValidator);
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});
module.exports = mongoose.model("User", userSchema);
