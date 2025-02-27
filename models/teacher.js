const mongoose = require('mongoose')

const teacherSchema = new mongoose.Schema({
  fullName: {
    type:String,
    require: true
  },
  email: {
    type:String,
    lowercase: true,
    require:true
  },
  password: {
    type: String,
    require: true
  },
  teacherStack:{
    type:String,
    enum: ['Frontend','Backend','Product-Design'],
    require:true,
  },
  isVerified: {
    type:Boolean,
    default:false
  },
  isAdmin: {
    type:Boolean,
    default:false
  },
  isSuperAdmin: {
    type: Boolean,
    default:false
  },
 
  studentId : [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Students',
    require:true
  }],
  adminId : {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Admins',
    require:true
  }
 

}, {timestamps: true})

const teacherModel = mongoose.model('Teachers',teacherSchema)

module.exports = teacherModel;