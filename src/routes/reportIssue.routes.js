import { Router } from "express";
import { issueController } from "../controllers/index.js";

const reportIssueRouter = Router();

reportIssueRouter.post('/report-issue', issueController.reportIssue)
reportIssueRouter.get('/get-all-issues', issueController.getIssues)
reportIssueRouter.post('/resolve-issue', issueController.resolveIssue)

export default reportIssueRouter;