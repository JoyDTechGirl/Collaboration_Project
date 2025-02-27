const {register, verifyAndResendEmail, login, forgotPassword, resetPassword, changePassword, readStudentDetails } = require('../Controlers/studentController');

const {authenticate } = require('../middleware/authentication')


const router = require('express').Router()

router.post('/register',register)

router.get('/verify-email/:token',verifyAndResendEmail);

router.post('/login',login)

router.post('/forget-password',forgotPassword)

router.post('/forget-password/resetPassword/:token',resetPassword)

router.post('/resend-verification/changePassword/:studentId',changePassword)

router.get('/readStudentDetails/:studentId',authenticate,readStudentDetails)

module.exports = router;