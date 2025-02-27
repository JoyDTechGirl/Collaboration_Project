const studentModel = require('../models/Student')
const teacherModel = require('../models/teacher')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const {signUpTemplate, forgotTemplate} = require('../utils/mailTemplate');
const sendEmail = require('../middleware/nodemailer')


exports.register = async(req,res) => {
  try{
    const {fullName,email,stack,password} = req.body;

    const existingEmail = await studentModel.findOne({email:email.toLowerCase()})

    if(existingEmail){
      return res.status(400).json({message: `student with this email ${email} already exist`})
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const newStudent = new studentModel({
      fullName,
      email,
      stack,
      password: hashedPassword
    });

    const token = await jwt.sign({studentId: newStudent._id},process.env.JWT_SECRET,{expiresIn: '2days'})

    const link = `${req.protocol}://${req.get('host')}/api/v1/verify-email/${token}`

    const firstName = newStudent.fullName.split(' ')[0]

    const mailDetails = {
      subject: 'Welcome mail',
      email: newStudent.email,
      html: signUpTemplate(link,firstName)
    }

    await sendEmail(mailDetails)

    await newStudent.save()

    res.status(201).json({message:'student Register Successfully',data:newStudent,token})
    
  }catch(err){
    console.log(err.message)
    res.status(500).json({message: 'Internal Server Error'})
  }
};



exports.verifyAndResendEmail = async(req,res) => {
  try{
    const {token} = req.params;

    if(token === null){
      return res.status(404).json({message: 'Token Not Found'})
    }

    jwt.verify(token, process.env.JWT_SECRET, async(err,payload) => {
      if(err){
        if(err instanceof jwt.JsonWebTokenError){
          const decodedToken = jwt.decode(token)
          const student = await studentModel.findById(decodedToken.studentId)

          if(student === null){
            return res.status(404).json({message: 'student Not Found'})
          }

          if(student.isVerified === true){
            return res.status(400).json({message: 'student has already been verified'})
          }

          const newToken = await jwt.sign({studentId:student._id}, process.env.JWT_SECRET, {expiresIn: '1h'})

          const link = `${req.protocol}://${req.get('host')}/api/v1/verify-email/${newToken}`

          const firstName = student.fullName.split(' ')[0]

          const mailDetail = {
            subject: 'Email Verification',
            email: student.email,
            html: signUpTemplate(link,firstName)
          }

          await sendEmail(mailDetail)
          res.status(200).json({message: 'Link expired, please check your email for new link'})
        }
      }else{
        console.log(payload)
        const student = await studentModel.findById(payload.studentId)

        if(student === null){
          return res.status(404).json({message: 'student Not Found'})
        }

        if(student.isVerified === true){
         return  res.status(400).json({message: 'student has already been verified'})
        }
        student.isVerified = true
        await student.save()

        res.status(200).json({message: 'Verification link successfully sent,please check your email'})
      }
    })
  }catch(err){
    console.log(err.message)
    res.status(500).json({message:'Internal Server Error'})
  }
};



exports.login = async(req,res) => {
  try{
    const {email,password} = req.body

    if(!email) {
      return res.status(400).json({message: 'Please enter your email'})
    }
    if(!password){
      return res.status(400).json({message: 'Enter your password'})
    }

    const student = await studentModel.findOne({email:email.toLowerCase()})

    if(student === null){
      return res.status(404).json({message: 'Student Not Found'})
    }

    const isCorrectPassword = await bcrypt.compare(password, student.password)

    if(isCorrectPassword === false){
      return res.status(400).json({message: 'Incorrect Password'})
    }

    if(student.isVerified === false){
      return res.status(400).json({message: 'Account not verify, Please check your email for verification link'})
    }

    const token = await jwt.sign({studentId: student._id}, process.env.JWT_SECRET, {expiresIn: '1day'})

    res.status(200).json({message: 'Login Successfully',data:student })
  }catch(err){
    console.log(err.message)
    res.status(500).json({message: 'Internal server error'})
  }
}


exports.forgotPassword = async(req,res) => {
  try{
    const {email} = req.body;

    if(!email){
      return res.status(400).json({message: 'please enter your email'})
    }

    const student = await studentModel.findOne({email:email.toLowerCase()})
    if(!student){
      return res.status(404).json({message: 'student Not Found'})
    }

    const token = await jwt.sign({studentId: student._id}, process.env.JWT_SECRET, { expiresIn: '15mins'})

    const link = `${req.protocol}://${req.get('host')}/api/v1/forget-password/${token}`

    const firstName = student.fullName.split(' ')[1]

    const mailDetail = {
      subject: 'Password Reset',
      email: student.email,
      html: forgotTemplate(link,firstName)
    }

    await sendEmail(mailDetail);

    res.status(200).json({message: 'Password reset initiated,Please check your email for the reset link'})
  }catch(err){
    console.log(err.message)
    res.status(500).json({message: 'Internal Server Error'})
  }
};




exports.resetPassword = async(req,res) => {
  try{
    const {token} = req.params;

    if(!token){
      return res.status(404).json({message: 'Token Not Found'})
    }

    const {password, confirmPassword} = req.body;

    const {studentId} = await jwt.verify(token,process.env.JWT_SECRET)

    const student = await studentModel.findById(studentId)

    if(!student){
      return res.status(404).json({message: 'Student Not Found'})
    }
    if(password !== confirmPassword){
      return res.status(400).json({message: 'Password does not match'})
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    student.password = hashedPassword

    await student.save()

    res.status(200).json({message: 'password reset successful'})

  }catch(err){
    console.log(err.message)
    if(err instanceof jwt.JsonWebTokenError){
      return res.status(400).json({message: 'Link expired,please press the required link'})
    }
    res.status(500).json({message: 'Internal Server Error'})
  }
};



exports.changePassword = async (req, res) => {
  try {
    const {studentId} = req.params

    const {oldPassword, newPassword, confirmPassword} = req.body

    const student = await studentModel.findById(studentId)

    if(!student) {
      return res.status(404).json({message: 'student not found'})
    }

    const isCorrectPassword = await bcrypt.compare(oldPassword, student.password)

    if(!isCorrectPassword) {
      return res.status(400).json({message: 'please enter your correct password'})
    }

    if(newPassword !== confirmPassword) {
      return res.status(400).json({message: 'passwords do not match'})
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    // console.log(newPassword,salt)

    student.password = hashedPassword

    await student.save()

    res.status(200).json({message: 'your password has been changed sucessfully'})


  } catch (err) {
    console.log(err.message)
    res.status(500).json({message: 'Internal Server Error'})
  }
};




exports.readStudentDetails = async (req, res) => {
  try {

    const {studentId} = req.params

    const student = await studentModel.findById(studentId)
    if(!student) {
      return res.status(404).json({message: 'student not found'})
    }

    const studentDetails = await studentModel.findById(studentId)


    res.status(200).json({message: `student details below with ratings for ${student.fullName}`, data: studentDetails})

    
  } catch (error) {
    console.log(error.message)
    res.status(500).json({message: 'Internal Server Error'})
  }
}
