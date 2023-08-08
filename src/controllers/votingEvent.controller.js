import mongoose from "mongoose";
import { User, Voter, VotingEvent } from "../SchemasModels/model.js";
import { HttpStatus } from "../constant/constants.js";

// Create event
export const createVotingEvent = async (req, res) => {

    const { title, description, eventLocation } = req.body;

    if (!title || !description || !eventLocation) return res.status(HttpStatus.BAD_REQUEST).json({ message: "All the fields are required" })

    const event = VotingEvent({ title, description, eventLocation })

    await event.save();

    res.status(HttpStatus.OK).json({ message: "Event is created successfully" })

}

// get events
export const getAllVotingEvents = async (req, res) => {
    const votingEvents = await VotingEvent.find({}, { candidates: false });

    return res.status(HttpStatus.OK).json({ data: votingEvents, message: "All voting events" });
}

// add candidate
export const addCandidate = async (req, res) => {

    const votingEventID = req.params.votingEventID;

    if (!votingEventID) return res.status(HttpStatus.BAD_REQUEST).json({ message: "Voting Event ID is missing" })

    // Checking if the document id is valid or not
    if (!mongoose.Types.ObjectId.isValid(votingEventID)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'No such voting Event exists' })
    }

    const { candidateName, citizenshipNumber, voterID, phoneNumber } = req.body;


    if (!candidateName || !citizenshipNumber || !voterID || !phoneNumber) return res.status(HttpStatus.BAD_REQUEST).json({ message: "All the fields are required" })

    // Getting event if exists
    const votingEvent = await VotingEvent.findById({ _id: votingEventID })

    if (!votingEvent) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'No such voting Event exists' })
    }

    const isCandidateExists = await VotingEvent.find({
        _id: votingEventID,
        $or: [{ "candidates.citizenshipNumber": citizenshipNumber }, { "candidates.voterID": voterID }]
    })

    console.log(isCandidateExists)

    if (isCandidateExists.length) {
        return res.status(HttpStatus.CONFLICT).json({ message: "Candidate Already Exists" })
    }

    const candidateInfo = { candidateName, citizenshipNumber, voterID, phoneNumber }

    votingEvent.candidates.push(candidateInfo)

    await votingEvent.save()

    return res.status(HttpStatus.OK).json({ message: "Candidate added successfully" })

}

// Get all candidates
export const getCandidates = async (req, res) => {

    const votingEventID = req.params.votingEventID;

    if (!votingEventID) return res.status(HttpStatus.BAD_REQUEST).json({ message: "Voting Event ID is missing" })

    // Checking if the document id is valid or not
    if (!mongoose.Types.ObjectId.isValid(votingEventID)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'No such voting Event exists' })
    }

    // Getting event if exists
    const candidates = await VotingEvent.findById({ _id: votingEventID }, { _id: false, candidates: true })

    if (!candidates) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'No such voting Event exists' })
    }

    return res.status(HttpStatus.OK).json({ data: candidates, message: "All the candidates for this event" })

}

// Check if user can vote or not
export const checkUserVotingStatus = async (req, res) => {

    const { votingEventID, citizenshipNumber, voterID } = req.body;

    if (!votingEventID || !citizenshipNumber || !voterID) return res.status(HttpStatus.BAD_REQUEST).json({ message: "All the fields are required" })

    // Checking voting event
    const isVotingEventExists = await VotingEvent.findOne({ _id: votingEventID })
    if (!isVotingEventExists) return res.status(HttpStatus.NOT_FOUND).json({ message: "No Such events exists" })

    //Checking is user exists or not
    const isUserExists = await User.findOne({ citizenshipNumber: citizenshipNumber, voterID: voterID });
    if (!isUserExists) return res.status(HttpStatus.CONFLICT).json({ message: "User does not exist" });

    // Checking if the document id is valid or not
    if (!mongoose.Types.ObjectId.isValid(votingEventID)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'No such voting Event exists' })
    }

    const isUserEligibleForVoting = await Voter.findOne({
        votingEventID: votingEventID,
        "user.citizenshipNumber": citizenshipNumber,
        "user.voterID": voterID
    })

    return res.status(HttpStatus.OK).json({ data: { isUserEligibleForVoting: !Boolean(isUserEligibleForVoting) } })
}


// Vote the candidate
export const vote = async (req, res) => {

    const { votingEventID, candidate, user } = req.body

    if (!votingEventID || !candidate || !user || !candidate.citizenshipNumber || !candidate.voterID || !user.voterID || !user.citizenshipNumber) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "All the fields are required" })
    }

    //Checking is user exists or not
    const isUserExists = await User.findOne({ citizenshipNumber: user.citizenshipNumber, voterID: user.voterID });
    if (!isUserExists) return res.status(HttpStatus.CONFLICT).json({ message: "User does not exist" });

    // Checking if the document id is valid or not
    if (!mongoose.Types.ObjectId.isValid(votingEventID)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'No such voting Event exists' })
    }

    // Checking voting event
    const isVotingEventExists = await VotingEvent.findOne({ _id: votingEventID })
    if (!isVotingEventExists) return res.status(HttpStatus.NOT_FOUND).json({ message: "No Such events exists" })

    // Checking if candidate exists or not
    const isCandidateExists = await VotingEvent.findOne({
        _id: votingEventID,
        "candidates.citizenshipNumber": candidate.citizenshipNumber,
        "candidates.voterID": candidate.voterID
    });
    if (!isCandidateExists) return res.status(HttpStatus.NOT_FOUND).json({ message: "No Such Candidate Exists" })

    // Checking if user is eligible for voting
    const hasUserAlreadyVoted = await Voter.findOne({
        votingEventID: votingEventID,
        "user.citizenshipNumber": user.citizenshipNumber,
        "user.voterID": user.voterID
    })

    if (hasUserAlreadyVoted) return res.status(HttpStatus.BAD_REQUEST).json({ message: "User has already voted" })


    // Updating voter list
    const voter = Voter({
        votingEventID,
        candidate,
        user
    })

    await voter.save();

    // Updating vote count
    const votingEvent = await VotingEvent.findOneAndUpdate(
        {
            _id: votingEventID,
            "candidates.citizenshipNumber": candidate.citizenshipNumber,
            "candidates.voterID": candidate.voterID
        },
        {
            $inc: { "candidates.$.totalVoteCount": 1 }
        },
        { new: true }
    );

    console.log(votingEvent)

    res.status(HttpStatus.OK).json({ message: "Voting has been successfully submitted" })

}