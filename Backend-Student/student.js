const mongoose = require("mongoose");
const { Bool } = require("mongoose/lib/schema/index");
const studentschema = mongoose.Schema({
  student_id: {
    type: String,
    required: true,
    trim: true,
  },
  student_name: {
    type: String,
    required: true,
    trim: true,
  },
  student_password: {
    type: String,
    required: true,
    trim: true,
    
  },
  student_email: {
    type: String,
    required: true,
    trim: true,
  },
  student_usn: {
    type: String,
    required: true,
    trim: true,
  },
  student_dob: {
    type: String,
    required: true,
    trim: true,
  },
  student_class: {
    type:String,
    required: true,
    trim: true,
    default:2
  },
  student_gender: {
    type: String,
    required: true,
    trim: true,
  },
  student_exams:[{
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
    exam_marks: {
      type: String,
      required: true,
      trim: true,
    },
    exam_remarks: {
      type: String,
      required: true,
      trim: true,
    },
  }],
  isactive: {
    type: String,
    required: true,
    trim: true,
  },
});
const studentModel = mongoose.model("student", studentschema);
module.exports = studentModel;
