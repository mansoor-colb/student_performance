const mongoose = require("mongoose");
const { Bool } = require("mongoose/lib/schema/index");
const examschema = mongoose.Schema({
  exam_id: {
    type: String,
    required: true,
    trim: true,
  },
  exam_name: {
    type: String,
    required: true,
    trim: true,
  },
  exam_date: {
    type: String,
    required: true,
    trim: true,
  },
 exam_max: {
    type: String,
    required: true,
    trim: true,
  },
 exam_min: {
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
const examModel = mongoose.model("exam", examschema);
module.exports = examModel;
