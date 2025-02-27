const studentModel = require('../models/Student')
const teacherModel = require('../models/teacher');
const adminModel = require('../models/admin');
const jwt = require('jsonwebtoken');




exports.authenticate = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth) {
            return res.status(400).json({
                message: "Token not found",
            });
        }
        const token = auth.split(" ")[1];
        if (!token) {
            return res.status(400).json({
                message: "Invalid token",
            });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        let user;
        user = await adminModel.findById(decodedToken.adminId);
        user = await teacherModel.findById(decodedToken.teacherId)
        user = await studentModel.findById(decodedToken.studentId)
        if (!user) {
            return res.status(404).json({
                message: "Authentication Failed: User not found",
            });
        }
        req.user = decodedToken;

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({
                message: "Session timed-out: Please login to continue",
            });
        }
        res.status(500).json({
            message: "Internal Server Error" + error.message,
        });
    }
};

exports.authenticateAdmin = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth) {
            return res.status(400).json({
                message: "Token not found",
            });
        }

        const token = auth.split(" ")[1];
        if (!token) {
            return res.status(400).json({
                message: "Invalid token",
            });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        let user;
        user = await adminModel.findById(decodedToken.userId);
        user = await teacherModel.findById(decodedToken.userId)
        if (!user) {
            return res.status(404).json({
                message: "Authentication Failed: User not found",
            });
        }

        if (user.isAdmin !== true && user.isSuperAdmin !== true) {
            return res.status(401).json({
                message: "Unauthorized: Please contact Admin",
            });
        }

        req.user = decodedToken;
        next();

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error" + error.message,
        });
    }
};

exports.authenticateSuperAdmin = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth) {
            return res.status(400).json({
                message: "Token not found",
            });
        }

        const token = auth.split(" ")[1];
        if (!token) {
            return res.status(400).json({
                message: "Invalid token",
            });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await adminModel.findById(decodedToken.userId);
        if (!user) {
            return res.status(404).json({
                message: "Authentication Failed: User not found",
            });
        }

        if (user.isSuperAdmin !== true) {
            return res.status(401).json({
                message: "Unauthorized: Please contact Admin",
            });
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error" + error.message,
        });
    }
};
