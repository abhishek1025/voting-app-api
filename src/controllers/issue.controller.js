import { Issue } from "../SchemasModels/model.js";
import { HttpStatus } from "../constant/constants.js";

export const reportIssue = async (req, res) => {

    const { issue, description } = req.body;

    if (!issue || !description) return res.status(HttpStatus.OK).json({ message: "All the fields are required" })

    const issueModel = Issue({ issue, description });

    await issueModel.save();

    return res.status(HttpStatus.OK).json({ message: "Issues is submitted to admin, will get back to you soon" })
}


export const getIssues = async (req, res) => {

    const issues = await Issue.find().sort({ createdAt: -1 });

    return res.status(HttpStatus.OK).json({ data: issues, message: "All the issues" })

}

export const resolveIssue = async (req, res) => {
    const { issueID } = req.body;

    if (!issueID) {
        return res.status(HttpStatus.BAD_REQUEST).json({ "message": "Issue ID is required" })
    }

    const issue = await Issue.findById(issueID);

    if (!issue) {
        return res.status(HttpStatus.NOT_FOUND).json({ "message": "Issue Not found" })
    }

    issue.resolved = true;

    await issue.save();

    return res.status(HttpStatus.OK).json({ "message": "Issue  Resolved" })
}