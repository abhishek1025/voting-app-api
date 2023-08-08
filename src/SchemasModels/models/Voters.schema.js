import mongoose, { Schema } from "mongoose";

const voterSchema = new mongoose.Schema({

    votingEventID: {
        type: Schema.Types.ObjectId,
        required: [true, "Voting event ID is required"],
    },

    candidate: {
        citizenshipNumber: {
            type: String,
            required: [true, "Candidate citizenship is required"],
        },
        voterID: {
            type: String,
            required: [true, "Candidate citizenship is required"],
        }
    },

    user: {
        citizenshipNumber: {
            type: String,
            required: [true, "User citizenship is required"],
        },
        voterID: {
            type: String,
            required: [true, "User citizenship is required"],
        }
    }

}, { timestamps: true })

export default voterSchema;