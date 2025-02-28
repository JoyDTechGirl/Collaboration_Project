const studentModel = require('../models/Student')
const teacherModel = require('../models/teacher')
const adminModel = require('../models/admin')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const {signUpTemplate, forgotTemplate} = require('../utils/mailTemplate');
const sendEmail = require('../middleware/nodemailer')



exports.registerAdmin = async(req,res) => {
    try{
      const {fullName,email,password} = req.body;
  
      const existingEmail = await adminModel.findOne({email:email.toLowerCase()})
  
      if(existingEmail){
        return res.status(400).json({message: `admin with this email ${email} already exist`})
      }
  
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password,salt)
  
      const newAdmin = new adminModel({
        fullName,
        email,
        password: hashedPassword
      });
  
      const token = await jwt.sign({adminId: newAdmin._id},process.env.JWT_SECRET,{expiresIn: '2days'})
  
    //   const link = `${req.protocol}://${req.get('host')}/api/v1/verify-email/${token}`
  
    //   const firstName = newAdmin.fullName.split(' ')[0]
  
    //   const mailDetails = {
    //     subject: 'Welcome mail',
    //     email: newAdmin.email,
    //     html: signUpTemplate(link,firstName)
    //   }
  
    //   await sendEmail(mailDetails)
  
      await newAdmin.save()
  
      res.status(201).json({message:'admin Registered Successfully',data:newAdmin, token})
      
    }catch(err){
      console.log(err.message)
      res.status(500).json({message: 'Internal Server Error'})
    }
};




exports.loginAdmin = async(req,res) => {
    try{
      const {email,password} = req.body
  
      if(!email) {
        return res.status(400).json({message: 'Please enter your email'})
      }
      if(!password){
        return res.status(400).json({message: 'Enter your password'})
      }
  
      const admin = await adminModel.findOne({email:email.toLowerCase()})
  
      if(admin === null){
        return res.status(404).json({message: 'admin Not Found'})
      }
  
      const isCorrectPassword = await bcrypt.compare(password, admin.password)
  
      if(isCorrectPassword === false){
        return res.status(400).json({message: 'Incorrect Password'})
      }
  
      const token = await jwt.sign({adminId: admin._id}, process.env.JWT_SECRET, {expiresIn: '1day'})
  
      res.status(200).json({message: 'Login Successfully',data:admin })

    }catch(err){
      console.log(err.message)
      res.status(500).json({message: 'Internal server error'})
    }
}
  



exports.forgotAdminPassword = async(req,res) => {
    try{
      const {email} = req.body;
  
      if(!email){
        return res.status(400).json({message: 'please enter your email'})
      }
  
      const admin = await adminModel.findOne({email:email.toLowerCase()})
      if(!admin){
        return res.status(404).json({message: 'admin Not Found'})
      }
  
      const token = await jwt.sign({adminId: admin._id}, process.env.JWT_SECRET, { expiresIn: '15mins'})
  
      const link = `${req.protocol}://${req.get('host')}/api/v1/forget-password/${token}`
  
      const firstName = admin.fullName.split(' ')[1]
  
      const mailDetail = {
        subject: 'Password Reset',
        email: admin.email,
        html: forgotTemplate(link,firstName)
      }
  
      await sendEmail(mailDetail);
  
      res.status(200).json({message: 'Password reset initiated,Please check your email for the reset link'})
    }catch(err){
      console.log(err.message)
      res.status(500).json({message: 'Internal Server Error'})
    }
};



exports.resetAdminPassword = async(req,res) => {
    try{
      const {token} = req.params;
  
      if(!token){
        return res.status(404).json({message: 'Token Not Found'})
      }
  
      const {password, confirmPassword} = req.body;
  
      const {adminId} = await jwt.verify(token,process.env.JWT_SECRET)
  
      const admin = await adminModel.findById(adminId)
  
      if(!admin){
        return res.status(404).json({message: 'admin Not Found'})
      }
      if(password !== confirmPassword){
        return res.status(400).json({message: 'Password does not match'})
      }
  
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password,salt)
  
      admin.password = hashedPassword
  
      await admin.save()
  
      res.status(200).json({message: 'password reset successful'})
  
    }catch(err){
      console.log(err.message)
      if(err instanceof jwt.JsonWebTokenError){
        return res.status(400).json({message: 'Link expired,please press the required link'})
      }
      res.status(500).json({message: 'Internal Server Error'})
    }
};
  



exports.changeAdminPassword = async (req, res) => {
    try {
      const {adminId} = req.params
  
      const {oldPassword, newPassword, confirmPassword} = req.body
  
      const admin = await adminModel.findById(adminId)
  
      if(!admin) {
        return res.status(404).json({message: 'admin not found'})
      }
  
      const isCorrectPassword = await bcrypt.compare(oldPassword, admin.password)
  
      if(!isCorrectPassword) {
        return res.status(400).json({message: 'please enter your correct password'})
      }
  
      if(newPassword !== confirmPassword) {
        return res.status(400).json({message: 'passwords do not match'})
      }
  
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)
      // console.log(newPassword,salt)
  
      admin.password = hashedPassword
  
      await admin.save()
  
      res.status(200).json({message: 'your password has been changed sucessfully'})
  
  
    } catch (err) {
      console.log(err.message)
      res.status(500).json({message: 'Internal Server Error'})
    }
};




exports.makeTeacherAdmin = async (req,res) => {
  try{
    console.log('Received request to make teacher admin');
    const {teacherId} = req.params

    const teacher = await teacherModel.findById(teacherId)
    console.log('Teacher fetched:', teacher);

    if(!teacher) {
      console.log('Teacher not found');
      return res.status(404).json({message: 'teacher not found'})
    }

    if(teacher.isAdmin === true) {
      console.log('Teacher is already an admin');
      return res.status(400).json({message: 'teacher is already an admin'})
    }

    teacher.isAdmin = true
    await teacher.save()
    console.log('Teacher admin status updated');

    return res.status(200).json({message: 'teacher is now an admin', data: teacher})
  }catch(err){
    console.log('Error:', err.message);
   return res.status(500).json({message: 'Internal Server Error'})
  }
};
 




exports.createNewStudent = async (req,res) => {
    try {
        const {fullName,email,password, stack} = req.body

        
        if(!fullName || !email || !password || !stack) {
            return res.status(400).json({message: 'Please enter all details'})
        }

        const existingEmail = await studentModel.findOne({email:email.toLowerCase()})

        if(existingEmail){
          return res.status(400).json({message: `student with this email ${email} already exist`})
        }
    
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)



        const newStudent = new studentModel({
            fullName,
            email,
            password: hashedPassword
        })

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
    
        res.status(201).json({message:'student Registered Successfully',data:newStudent,token})

        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'Internal Server Error'})
    }
}




exports.createNewTeacher = async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'Internal Server Error'})
    }
}



exports.getAllStudents = async (req, res) => {
    try {
        const student = await studentModel.find()

        res.status(200).json({message: 'these are all students', data: student})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'Internal Server Error'})
    }
}



exports.getAllTeachers = async (req, res) => {
    try {
        const teacher = await teacherModel.find()

        res.status(200).json({message: 'these are all teachers', data: teacher})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'Internal Server Error'})
    }
}




exports.updateStudent = async (req, res) => {
    try {
        const {studentId} = req.params

        const { fullName, email, stack } = req.body;


        const student = await studentModel.findById(studentId)

        if(!student) {
            return res.status(404).json({message: 'student not found'})
        }

        const newStudent = {
            fullName,
            email,
            stack
        }


        const updatedStudent = await studentModel.findByIdAndUpdate(studentId, newStudent, {new:true})

        res.status(200).json({message: 'student has been updated successfully', data:updatedStudent})


    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'Internal Server Error'})
    }
}




exports.updateTeacher = async (req, res) => {
    try {
        const {teacherId} = req.params

        const { fullName, email, teacherStack } = req.body;

        const teacher = await teacherModel.findById(teacherId)

        if(!teacher) {
          return res.status(404).json({message: 'teacher not found'})
        }

        const newTeacher = {
          fullName,
          email,
          teacherStack
        }


        const updatedTeacher = await teacherModel.findByIdAndUpdate(teacherId, newTeacher, {new:true})

        res.status(200).json({message: 'teacher has been updated successfully', data:updatedTeacher})


    } catch (error) {
      console.log(error.message)
      res.status(500).json({message: 'Internal Server Error'})
    }
}




exports.deleteStudent = async (req, res) => {
    try {
        const {studentId} = req.params

        const student = await studentModel.findById(studentId)

        if(!student) {
            return res.status(404).json({message: 'student not found'})
        }

        const deletedStudent = await studentModel.findByIdAndDelete(studentId)

        res.status(200).json({message: 'student has been deleted successfully', data: deletedStudent})

        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'Internal Server Error'})
    }
}




exports.deleteTeacher = async (req, res) => {
    try {
        const {teacherId} = req.params

        const teacher = await teacherModel.findById(teacherId)

        if(!teacher) {
            return res.status(404).json({message: 'teacher not found'})
        }

        const deletedTeacher = await teacherModel.findByIdAndDelete(teacherId)

        res.status(200).json({message: 'teacher has been deleted successfully', data: deletedTeacher})

        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'Internal Server Error'})
    }
};






// exports.getTeacherAndAssignStudent = async(req,res) => {
//   try{
//     const {teacherStack} = req.params;

//     const teacher = await teacherModel.findOne({stack: teacherStack})

//     if(teacher === null){
//       return res.status(404).json({message: 'Teacher Not Found'})
//     }

//     const result = teacher.populate('fullName','email','gender','stack')
//     res.status(200).json({message: 'Teacher Assign Student Successfully',data:result,totalStudents:studentId.length})
//   }catch(err){
//     console.log(err.message)
//     res.status(500).json({message: 'Error Getting All Teacher'})
//   }
// };




exports.getTeacherAndAssignStudent = async (req, res) => {
  try {
    const {teacherId} = req.params

    const teacher = await teacherModel.findById(teacherId).populate('studentId', ['fullName', 'email', 'stack'])

    if(!teacher) {
      return res.status(404).json({message: 'teacher not found'})
    }

    res.status(200).json({message: 'find below the assigned teacher to student', data: teacher})
    

  } catch (err) {
    console.log(err.message)
    res.status(500).json({message: 'Error Getting Student'})
    
  }
}




exports.getStudentByStack = async(req,res) => {
  try{
    const {studentId} = req.params;
    const stack = req.body;

    const student = await studentModel.findOne({_id:studentId},{stack:stack})

    if(student === null){
      return res.status(404).json({message: 'Student Not Found'})
    }
    res.status(200).json({message: 'Student info below',data:student})
  }catch(err){
    console.log(err.message)
    res.status(500).json({message: 'Error Getting Student'})
  }
}




