const { registerUser, loginUser, logoutUser } = require("../services/auth.service")
const { createInterviewReport } = require("../services/interviewReport.service")
const { generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")


function showLoginPage(req, res) {
    res.render("login", { error: null })
}

function showRegisterPage(req, res) {
    res.render("register", { error: null })
}

async function handleLoginSubmit(req, res) {
    try {
        const { email, password } = req.body

        const { token } = await loginUser({ email, password })

        res.cookie("token", token)
        res.redirect("/")
    } catch (err) {
        res.status(err.status || 500).render("login", {
            error: err.message || "Login failed. Please try again."
        })
    }
}

async function handleRegisterSubmit(req, res) {
    try {
        const { username, email, password } = req.body

        const { token } = await registerUser({ username, email, password })

        res.cookie("token", token)
        res.redirect("/")
    } catch (err) {
        res.status(err.status || 500).render("register", {
            error: err.message || "Registration failed. Please try again."
        })
    }
}

async function handleLogout(req, res) {
    await logoutUser(req.cookies.token)
    res.clearCookie("token")
    res.redirect("/login")
}

async function showHomePage(req, res) {
    const reports = await interviewReportModel
        .find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .select("title matchScore createdAt")

    res.render("home", {
        reports,
        error: req.query.error || null
    })
}

async function handleGenerateReport(req, res) {
    const { jobDescription, selfDescription } = req.body

    if (!jobDescription || !jobDescription.trim()) {
        return res.redirect("/?error=" + encodeURIComponent("Please provide the target job description."))
    }

    if (!req.file && (!selfDescription || !selfDescription.trim())) {
        return res.redirect("/?error=" + encodeURIComponent("Please upload a resume or provide a self description."))
    }

    try {
        const interviewReport = await createInterviewReport({
            userId: req.user.id,
            resumeFileBuffer: req.file ? req.file.buffer : null,
            selfDescription,
            jobDescription
        })

        res.redirect(`/interview/${interviewReport._id}`)
    } catch (err) {
        res.redirect("/?error=" + encodeURIComponent(err.message || "Something went wrong while generating your report."))
    }
}

async function showInterviewPage(req, res) {
    const { interviewId } = req.params

    const report = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!report) {
        return res.status(404).render("not-found", {
            message: "This interview plan doesn't exist or you don't have access to it."
        })
    }

    res.render("interview", { report })
}

async function handleDownloadResume(req, res) {
    const { interviewId } = req.params

    const report = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!report) {
        return res.status(404).render("not-found", {
            message: "This interview plan doesn't exist or you don't have access to it."
        })
    }

    const { resume, jobDescription, selfDescription } = report

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = {
    showLoginPage,
    showRegisterPage,
    handleLoginSubmit,
    handleRegisterSubmit,
    handleLogout,
    showHomePage,
    handleGenerateReport,
    showInterviewPage,
    handleDownloadResume
}
