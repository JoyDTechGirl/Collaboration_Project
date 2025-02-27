const router = require('express').Router()
const {authenticateAdmin, authenticateSuperAdmin} = require('../middleware/authentication')

const {registerTeacher,verifyTeacherAndResendEmail,loginTeacher,forgotTeacherPassword,resetTeacherPassword,changeTeacherPassword, getAllStudents, getOneStudent} = require('../Controlers/teacherController')




router.post('/registerTeacher',registerTeacher)

router.get('/verification-email/:token',verifyTeacherAndResendEmail);

router.post('/loginTeacher',loginTeacher)

router.post('/forget-password',forgotTeacherPassword)

router.post('/forget-password/resetPassword/:token',resetTeacherPassword)

router.post('/changePassword/:teacherId',changeTeacherPassword)

router.get('/getAllStudents/', authenticateAdmin, getAllStudents)

router.get('/getOneStudent/:studentId', authenticateAdmin,getOneStudent)



// router.get('/readStudentDetails/:studentId',readStudentDetails)


module.exports = router

