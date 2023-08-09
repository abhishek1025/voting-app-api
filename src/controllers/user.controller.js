import { HttpStatus } from "../constant/constants.js";
import { User } from '../SchemasModels/model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {

    const { name, citizenshipNumber, voterID, password } = req.body;

    if (!name || !citizenshipNumber || !voterID || !password) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "All the fields are required" });
    }
    const isUserExists = await User.findOne({ citizenshipNumber, voterID });

    if (isUserExists) return res.status(HttpStatus.CONFLICT).json({ message: "User Already Exists" });

    const user = User({ name, citizenshipNumber, voterID, password });

    await user.save()

    res.status(200).json({ "message": "User registered successfully" })
}


export const logIn = async (req, res) => {

    const { citizenshipNumber, password } = req.body;

    if (!citizenshipNumber || !password) return res.status(HttpStatus.BAD_REQUEST).json({ message: "All the fields are required" })

    const user = await User.findOne({ citizenshipNumber });

    if (!user) return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });

    // Validating password
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Incorrect Password" })

    // Creating jwt token
    const jwtToken = await jwt.sign(
        { citizenshipNumber: user.citizenshipNumber, voterID: user.voterID, role: user.role },
        process.env.JWT_TOKEN_SECRET_KEY,
        { expiresIn: '1h' }
    )

    return res.status(HttpStatus.OK).json({
        message: "User authenticated Successfully",
        data: { name: user.name, citizenshipNumber: user.citizenshipNumber, voterID: user.voterID, token: jwtToken },
    })

}

export const forgotPassword = async (req, res) => {

    const { name, citizenshipNumber, voterID, newPassword } = req.body;

    if (!name || !citizenshipNumber || !voterID || !newPassword) return res.status(HttpStatus.BAD_REQUEST).json({ message: "All the fields required" })

    const user = await User.findOne({ name, citizenshipNumber, voterID });

    if (!user) return res.status(HttpStatus.CONFLICT).json({ message: "User does not exists, Please check the credentials" });

    user.password = newPassword;

    await user.save();

    return res.status(HttpStatus.OK).json({ message: "Password is changed successfully" })
}

export const getAllUsers = async (req, res) => {

    const users = await User.find({}, { _id: 0 });

    return res.status(HttpStatus.OK).json({ data: users, message: "All Users", })

}


