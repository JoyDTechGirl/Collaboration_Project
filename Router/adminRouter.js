
const router = require('express').Router()
const {authenticateAdmin, authenticateSuperAdmin} = require('../middleware/authentication')

const {registerAdmin,loginAdmin, forgotAdminPassword, resetAdminPassword , changeAdminPassword, makeTeacherAdmin,
       createNewStudent, createNewTeacher, getAllStudents, getAllTeachers, updateStudent,
       updateTeacher, deleteStudent, deleteTeacher, getTeacherAndAssignStudent, getStudentByStack
} = require('../Controlers/adminController')



router.post('/registerAdmin',registerAdmin)

router.post('/loginAdmin',loginAdmin)

router.post('/forget-password',forgotAdminPassword)

router.post('/forget-password/:token',resetAdminPassword)

router.post('/changeAdminPassword/:adminId',changeAdminPassword)

router.post('/makeTeacherAdmin/:teacherId', authenticateSuperAdmin, makeTeacherAdmin)

router.post('/createNewStudent', authenticateSuperAdmin, createNewStudent)

router.post('/createNewTeacher', authenticateSuperAdmin, createNewTeacher)

router.get('/getAllStudents', authenticateSuperAdmin, getAllStudents)

router.get('/getAllTeachers', authenticateSuperAdmin, getAllTeachers)

router.put('/updateStudent/:studentId', authenticateSuperAdmin, updateStudent)

router.put('/updateTeacher/:teacherId', authenticateSuperAdmin, updateTeacher)

router.delete('/deleteStudent/:studentId', authenticateSuperAdmin, deleteStudent)

router.delete('/deleteTeacher/:teacherId', authenticateSuperAdmin, deleteTeacher)

router.get('/getTeacherAndAssignStudent/:teacherId',authenticateSuperAdmin,getTeacherAndAssignStudent)

router.get('/getStudentByStack/:studentId', authenticateSuperAdmin, getStudentByStack)





module.exports = router