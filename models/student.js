const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    require: true
  },
  email: {
    type:String,
    lowercase: true,
    require:true
  },
  stack:{
    type:String,
    enum: ['Frontend','Backend','Product-Design'],
    require:true,
  },
  password: {
    type:String,
    require: true
  },
  isVerified: {
    type:Boolean,
    default:false
  },
   adminId : {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Admins',
    require:true
  },
  teacherId : {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Teachers',
    require:true
  }
  
},{
  timestamps: true
});

const studentModel = mongoose.model('Students',studentSchema)
module.exports = studentModel;