import { Router } from "express";
import { issueController } from "../controllers/index.js";

const reportIssueRouter = Router();

reportIssueRouter.post('/report-issue', issueController.reportIssue)
reportIssueRouter.get('/get-all-issues', issueController.getIssues)

export default reportIssueRouter;