import { Router } from "express";
import { votingEventController } from "../controllers/index.js";

const votingEventRoutes = Router();

votingEventRoutes.post('/create-event', votingEventController.createVotingEvent);
votingEventRoutes.post('/add-candidate/:votingEventID', votingEventController.addCandidate)
votingEventRoutes.get('/get-all-events', votingEventController.getAllVotingEvents)
votingEventRoutes.get('/candidates/:votingEventID', votingEventController.getCandidates)
votingEventRoutes.get('/get-user-voting-status', votingEventController.checkUserVotingStatus)
votingEventRoutes.post('/vote', votingEventController.vote)


export default votingEventRoutes;