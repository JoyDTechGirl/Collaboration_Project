const studentModel = require('../models/Student')
const teacherModel = require('../models/teacher')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const {signUpTemplate, forgotTemplate} = require('../utils/mailTemplate');
const sendEmail = require('../middleware/nodemailer')


exports.registerTeacher = async(req,res) => {
    try{
      const {fullName,email,password, teacherStack} = req.body;
  
      const existingEmail = await teacherModel.findOne({email:email.toLowerCase()})
  
      if(existingEmail){
        return res.status(400).json({message: `teacher with this email ${email} already exist`})
      }
  
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password,salt)
  
      const newTeacher = new teacherModel({
        fullName,
        teacherStack,
        email,
        password: hashedPassword
      });
  
      const token = await jwt.sign({teacherId: newTeacher._id},process.env.JWT_SECRET,{expiresIn: '2days'})
  
      const link = `${req.protocol}://${req.get('host')}/api/v1/verify-email/${token}`
  
      const firstName = newTeacher.fullName.split(' ')[0]
  
      const mailDetails = {
        subject: 'Welcome mail',
        email: newTeacher.email,
        html: signUpTemplate(link,firstName)
      }
  
      await sendEmail(mailDetails)
  
      await newTeacher.save()
  
      res.status(201).json({message:'teacher Registered Successfully',data:newTeacher,token})
      
    }catch(err){
      console.log(err.message)
      res.status(500).json({message: 'Internal Server Error'})
    }
};



exports.verifyTeacherAndResendEmail = async(req,res) => {
    try{
      const {token} = req.params;
  
      if(token === null){
        return res.status(404).json({message: 'Token Not Found'})
      }
  
      jwt.verify(token, process.env.JWT_SECRET, async(err,payload) => {
        if(err){
          if(err instanceof jwt.JsonWebTokenError){
            const decodedToken = jwt.decode(token)
            const teacher = await teacherModel.findById(decodedToken.teacherId)
  
            if(teacher === null){
              return res.status(404).json({message: 'teacher Not Found'})
            }
  
            if(teacher.isVerified === true){
              return res.status(400).json({message: 'teacher has already been verified'})
            }
  
            const newToken = await jwt.sign({teacherId:teacher._id}, process.env.JWT_SECRET, {expiresIn: '1h'})
  
            const link = `${req.protocol}://${req.get('host')}/api/v1/verify-email/${newToken}`
  
            const firstName = teacher.fullName.split(' ')[0]
  
            const mailDetail = {
              subject: 'Email Verification',
              email: teacher.email,
              html: signUpTemplate(link,firstName)
            }
  
            await sendEmail(mailDetail)
            res.status(200).json({message: 'Link expired, please check your email for new link'})
          }
        }else{
          console.log(payload)
          const teacher = await teacherModel.findById(payload.teacherId)
  
          if(teacher === null){
            return res.status(404).json({message: 'teacher Not Found'})
          }
  
          if(teacher.isVerified === true){
           return  res.status(400).json({message: 'teacher has already been verified'})
          }
          teacher.isVerified = true
          await teacher.save()
  
          res.status(200).json({message: 'Verification link successfully sent,please check your email'})
        }
      })
    }catch(err){
      console.log(err.message)
      res.status(500).json({message:'Internal Server Error'})
    }
};



exports.loginTeacher = async(req,res) => {
    try{
      const {email,password} = req.body
  
      if(!email) {
        return res.status(400).json({message: 'Please enter your email'})
      }
      if(!password){
        return res.status(400).json({message: 'Enter your password'})
      }
  
      const teacher = await teacherModel.findOne({email:email.toLowerCase()})
  
      if(teacher === null){
        return res.status(404).json({message: 'teacher Not Found'})
      }
  
      const isCorrectPassword = await bcrypt.compare(password, teacher.password)
  
      if(isCorrectPassword === false){
        return res.status(400).json({message: 'Incorrect Password'})
      }
  
      if(teacher.isVerified === false){
        return res.status(400).json({message: 'Account not verify, Please check your email for verification link'})
      }
  
      const token = await jwt.sign({teacherId: teacher._id}, process.env.JWT_SECRET, {expiresIn: '1day'})
  
      res.status(200).json({message: 'Login Successfully',data:teacher })
    }catch(err){
      console.log(err.message)
      res.status(500).json({message: 'Internal server error'})
    }
}
  


exports.forgotTeacherPassword = async(req,res) => {
    try{
      const {email} = req.body;
  
      if(!email){
        return res.status(400).json({message: 'please enter your email'})
      }
  
      const teacher = await teacherModel.findOne({email:email.toLowerCase()})
      if(!teacher){
        return res.status(404).json({message: 'teacher Not Found'})
      }
  
      const token = await jwt.sign({teacherId: teacher._id}, process.env.JWT_SECRET, { expiresIn: '15mins'})
  
      const link = `${req.protocol}://${req.get('host')}/api/v1/forget-password/${token}`
  
      const firstName = teacher.fullName.split(' ')[1]
  
      const mailDetail = {
        subject: 'Password Reset',
        email: teacher.email,
        html: forgotTemplate(link,firstName)
      }
  
      await sendEmail(mailDetail);
  
      res.status(200).json({message: 'Password reset initiated,Please check your email for the reset link'})
    }catch(err){
      console.log(err.message)
      res.status(500).json({message: 'Internal Server Error'})
    }
};



exports.resetTeacherPassword = async(req,res) => {
    try{
      const {token} = req.params;
  
      if(!token){
        return res.status(404).json({message: 'Token Not Found'})
      }
  
      const {password, confirmPassword} = req.body;
  
      const {teacherId} = await jwt.verify(token,process.env.JWT_SECRET)
  
      const teacher = await teacherModel.findById(teacherId)
  
      if(!teacher){
        return res.status(404).json({message: 'teacher Not Found'})
      }
      if(password !== confirmPassword){
        return res.status(400).json({message: 'Password does not match'})
      }
  
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password,salt)
  
      teacher.password = hashedPassword
  
      await teacher.save()
  
      res.status(200).json({message: 'password reset successful'})
  
    }catch(err){
      console.log(err.message)
      if(err instanceof jwt.JsonWebTokenError){
        return res.status(400).json({message: 'Link expired,please press the required link'})
      }
      res.status(500).json({message: 'Internal Server Error'})
    }
};
  



exports.changeTeacherPassword = async (req, res) => {
    try {
      const {teacherId} = req.params
  
      const {oldPassword, newPassword, confirmPassword} = req.body
  
      const teacher = await teacherModel.findById(teacherId)
  
      if(!teacher) {
        return res.status(404).json({message: 'teacher not found'})
      }
  
      const isCorrectPassword = await bcrypt.compare(oldPassword, teacher.password)
  
      if(!isCorrectPassword) {
        return res.status(400).json({message: 'please enter your correct password'})
      }
  
      if(newPassword !== confirmPassword) {
        return res.status(400).json({message: 'passwords do not match'})
      }
  
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)
      // console.log(newPassword,salt)
  
      teacher.password = hashedPassword
  
      await teacher.save()
  
      res.status(200).json({message: 'your password has been changed sucessfully'})
  
  
    } catch (err) {
      console.log(err.message)
      res.status(500).json({message: 'Internal Server Error'})
    }
};





exports.getAllStudents = async (req, res) => {
    try {
        
        const allStudents = await studentModel.find()

        res.status(200).json({message: 'All students below', data: allStudents})

    } catch (error) {
        console.log(error.message)
      res.status(500).json({message: 'Internal Server Error'})
    }
}



exports.getOneStudent = async (req, res) => {
    try {
        
        const {studentId} = req.params

        const student = await studentModel.findById(studentId)

        if(!student) {
            return res.status(404).json({message:'student not found'})
        }
        res.status(200).json({message: 'view student with id below', data: student})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'Internal Server Error'})
    }
}












