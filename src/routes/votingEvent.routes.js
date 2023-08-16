import { Router } from "express";
import { votingEventController } from "../controllers/index.js";

const votingEventRoutes = Router();

votingEventRoutes.post('/create-event', votingEventController.createVotingEvent);
votingEventRoutes.delete('/delete-event', votingEventController.deleteVotingEvent)
votingEventRoutes.post('/add-candidate', votingEventController.addCandidate)
votingEventRoutes.get('/get-all-events', votingEventController.getAllVotingEvents)
votingEventRoutes.get('/candidates/:votingEventID', votingEventController.getCandidates)
votingEventRoutes.post('/get-user-voting-status', votingEventController.checkUserVotingStatus)
votingEventRoutes.post('/vote', votingEventController.vote)
votingEventRoutes.post('/pause-event', votingEventController.pauseVotingEvent)
votingEventRoutes.post('/start-event', votingEventController.startVotingEvent)
votingEventRoutes.post('/end-event', votingEventController.endVotingEvent)


export default votingEventRoutes;