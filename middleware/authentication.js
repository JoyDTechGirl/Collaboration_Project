const studentModel = require('../models/Student')
const teacherModel = require('../models/teacher');
const adminModel = require('../models/admin');
const jwt = require('jsonwebtoken');


exports.authenticate = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;

        if(!auth) {
            return res.status(401).json({message: 'token not found'})
        }
        
        const token = auth.split(' ')[1];
        if(!token) {
            return res.status(400).json({message:'invalid token'})
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

        const student = await studentModel.findById(decodedToken.studentId);
        if(!student) {
            return res.status(400).json({message: 'authentication failed'})
        }
        req.student = decodedToken

        next()
    } catch (error) {
        console.log(error.message)
        if(error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({message: 'session timed out, please login to continue'})
        }
    }
    res.status(500).json({message: 'internal server error'})
    
}



exports.authenticateAdmin = async (req, res, next) => {
    try {
        const auth = req.headers.authorization

        if(!auth) {
            return res.status(401).json({message: 'token not found'})
        }

        const token = auth.split(' ')[1];

        if(!token) {
            return res.status(400).json({message: 'invalid token'})
        }

        
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)

        const teacher = await teacherModel.findById(decodedToken.teacherId)
        if(!teacher) {
            return res.status(400).json({message: 'authentication failed'})
        }

        if(teacher.isAdmin === false) {
            return res.status(400).json({message: 'you are not authorized to access this route'})
        }

        req.teacher = decodedToken

        next()
    } catch (error) {
        console.log(error.message)
        if(error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({message: 'session timed out, please login to continue'})
        }
    }
    res.status(500).json({message: 'internal server error'})
    
}



exports.authenticateSuperAdmin = async (req, res, next) => {
    try {
        const auth = req.headers.authorization

        if(!auth) {
            return res.status(401).json({message: 'token not found'})
        }

        const token = auth.split(' ')[1];

        if(!token) {
            return res.status(400).json({message: 'invalid token'})
        }

        
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)

        const admin = await adminModel.findById(decodedToken.adminId)
        if(!admin) {
            return res.status(400).json({message: 'authentication failed'})
        }

        if(admin.isAdmin === false) {
            return res.status(400).json({message: 'you are not authorized to access this route'})
        }

        if(admin.isSuperAdmin === false) {
            return res.status(400).json({message: 'you are not authorized to access this route'})
        }

        req.admin = decodedToken

        next()
    } catch (error) {
        console.log(error.message)
        if(error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({message: 'session timed out, please login to continue'})
        }
    }
    res.status(500).json({message: 'internal server error'})
    
}
