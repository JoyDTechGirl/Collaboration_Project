
const router = require('express').Router()
const {authenticateAdmin, authenticateSuperAdmin, authenticate} = require('../middleware/authentication')

const {registerAdmin,loginAdmin, forgotAdminPassword, resetAdminPassword , changeAdminPassword, makeTeacherAdmin,
       createNewStudent, createNewTeacher
} = require('../Controlers/adminController')



router.post('/registerAdmin',registerAdmin)

router.post('/loginAdmin',loginAdmin)

router.post('/forget-password',forgotAdminPassword)

router.post('/forget-password/resetPassword/:token',resetAdminPassword)

router.post('/changeAdminPassword/:adminId',changeAdminPassword)

router.post('/makeTeacherAdmin/:teacherId', authenticateSuperAdmin, makeTeacherAdmin)

router.post('/createNewStudent', authenticateSuperAdmin, createNewStudent)

router.post('/createNewTeacher', authenticateSuperAdmin, createNewTeacher)








module.exports = router