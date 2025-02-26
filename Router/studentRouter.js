const {register, verifyAndResendEmail, login, forgotPassword, resetPassword, changePassword} = require('../Controlers/studentController');

const router = require('express').Router()

router.post('/register',register)

router.get('/verify-email/:token',verifyAndResendEmail);

router.post('/login',login)

router.post('/resend-verification/forgotPassword',forgotPassword)

router.post('/resend-verification/resetPassword/:token',resetPassword)

router.post('/resend-verification/changePassword/:studentId',changePassword)

module.exports = router;