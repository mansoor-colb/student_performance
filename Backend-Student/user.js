const mongoose = require("mongoose");
const { Bool } = require("mongoose/lib/schema/index");
const userschema = mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  isactive: {
    type: String,
    required: true,
    trim: true,
  },
});
const userModel = mongoose.model("user", userschema);
module.exports = userModel;
