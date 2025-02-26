const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
  fullName:{
    type:String,
    require:true
  },
  email: {
    type:String,
    require:true
  },
  password: {
    type:String,
    require:true
  },
  isVerified: {
    type:Boolean,
    default:true
  },
},{
  timestamp: true
});

const adminModel = mongoose.model('Admins',adminSchema)

module.exports = adminModel;