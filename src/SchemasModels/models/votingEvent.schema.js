import mongoose from "mongoose";


const candidateSchema = new mongoose.Schema({

    candidateName: String,

    citizenshipNumber: {
        type: String,
    },

    voterID: {
        type: String,
    },

    phoneNumber: String,

    totalVoteCount: {
        type: Number,
        default: 0
    },
})


const votingEventSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "Title is required"],
        uppercase: true
    },

    description: {
        type: String,
        required: [true, "Description is required"],
    },

    eventLocation: {
        type: String,
        required: [true, "Event Location is required"],
        uppercase: true
    },

    candidates: [candidateSchema],

    isVotingFinished: {
        type: Boolean,
        default: false,
    },

    isVotingStarted: {
        type: Boolean,
        default: false,
    },

    votingEventDeleted: {
        type: Boolean,
        default: false
    },

    endDate: {
        type: Date || null,
        default: null
    }

}, { timestamps: true })

export default votingEventSchema;