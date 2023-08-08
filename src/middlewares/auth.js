// import { createError } from '../config/createError.js';
import jwt from 'jsonwebtoken';
import { HttpStatus } from '../constant/constants.js';
import ROLE from '../enums/roles.enum.js';

export const verifyToken = async (req, res, next) => {
    let token = req.headers.authorization || req.cookies.accesstoken;
    console.log(req.headers.authorization)
    if (!token) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "Token required" });
    }
    try {
        if (token.includes(' ')) {
            token = token.split(' ')[1];
        }
        jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY, async (err, decoded) => {

            if (err) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
            }

            console.log(decoded)

            const { citizenshipNumber, voterID, role } = decoded;
            req.body = { citizenshipNumber, voterID, role }

            next();
        });
    } catch (error) {
        // console.log(error.message);
        // return next(error);
    }
};

export const verifyRole = (req, res, next) => {
    try {
        const role  = req.body.role;

        if (!role) {
            return res.status(400).json({ message: 'Bad Request!' });
        }
        if (role === ROLE.USER || role === ROLE.ADMIN) {
            next();
        } else {
            return res.status(403).json({ message: 'Access denied!' });
        }
    } catch (error) {
        return res.status(error?.status || 500).json({ message: error?.message });
    }
};

export const verifyAdmin = (req, res, next) => {
    try {
        const role = req.body.role;
        if (!role) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "Role is required" });
        }
        if (role === ROLE.ADMIN) {
            next();
        } else {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Only authorized to admin" });
        }
    } catch (error) {
        return next(error);
    }
};
