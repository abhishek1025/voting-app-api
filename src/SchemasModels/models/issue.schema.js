import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
    issue: {
        type: String,
        required: [true, "Issue is required"]
    },

    description: {
        type: String,
        required: [true, "Description is required"]
    },
    resolved: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })

export default issueSchema;