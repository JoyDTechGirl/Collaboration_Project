
const router = require('express').Router()
const {authenticateAdmin, authenticateSuperAdmin, authenticate} = require('../middleware/authentication')

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

router.post('/getAllStudents', authenticateSuperAdmin, getAllStudents)

router.post('/createNewTeacher', authenticateSuperAdmin, getAllTeachers)

router.post('/updateStudent/:studentId', authenticateSuperAdmin, updateStudent)

router.post('/updateTeacher/:teacherId', authenticateSuperAdmin, updateTeacher)

router.post('/updateTeacher/:teacherId', authenticateSuperAdmin, deleteStudent)

router.post('/updateTeacher/:teacherId', authenticateSuperAdmin, deleteTeacher)

router.post('/getTeacherAndAssignStudent/:teacherStack', authenticateSuperAdmin, getTeacherAndAssignStudent)

router.post('/getStudentByStack/:studentId', authenticateSuperAdmin, getStudentByStack)





module.exports = router