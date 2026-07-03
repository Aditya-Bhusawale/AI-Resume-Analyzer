const pdfParse = require("pdf-parse")
const { generateInterviewReport } = require("./ai.service")
const interviewReportModel = require("../models/interviewReport.model")


/**
 * @name createInterviewReport
 * @description parses the resume (if provided), asks the AI service for an interview
 * report, and persists it against the given user.
 */
async function createInterviewReport({ userId, resumeFileBuffer, selfDescription, jobDescription }) {

    let resumeContent = ""

    if (resumeFileBuffer) {
        const parsed = await (new pdfParse.PDFParse(Uint8Array.from(resumeFileBuffer))).getText()
        resumeContent = parsed.text
    }

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: userId,
        resume: resumeContent,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })

    return interviewReport
}

module.exports = { createInterviewReport }
