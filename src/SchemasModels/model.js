import mongoose from "mongoose";
import userSchema from "./models/user.schema.js";
import votingEventSchema from "./models/votingEvent.schema.js";
import voterSchema from "./models/Voters.schema.js";
import issueSchema from "./models/issue.schema.js";

export const User = mongoose.model('User', userSchema);
export const VotingEvent = mongoose.model('VotingEvent', votingEventSchema);
export const Voter = mongoose.model('Voter', voterSchema);
export const Issue = mongoose.model('Issue', issueSchema);
