import { HttpStatus } from "../constant/constants.js";
import { User } from '../SchemasModels/model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {

    const { name, role, citizenshipNumber, voterID, password } = req.body;

    if (!name || !role || !citizenshipNumber || !voterID || !password) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "All the fields are required" });
    }

    const isUserExists = await User.findOne({ citizenshipNumber, voterID });

    if (isUserExists) return res.status(HttpStatus.CONFLICT).json({ message: "User Already Exists" });

    const user = User({ name, role, citizenshipNumber, voterID, password });

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


