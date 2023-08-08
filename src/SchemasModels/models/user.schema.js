import mongoose from "mongoose";
import bcrypt from "bcrypt"


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
        },
        citizenshipNumber: {
            type: String,
            required: true,
            unique: true,
        },
        voterID: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
});

export default userSchema;