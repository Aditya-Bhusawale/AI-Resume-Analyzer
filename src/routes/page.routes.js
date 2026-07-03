const express = require("express")
const pageController = require("../controllers/page.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const upload = require("../middlewares/file.middleware")

const pageRouter = express.Router()

pageRouter.get("/login", authMiddleware.redirectIfAuthed, pageController.showLoginPage)
pageRouter.post("/login", authMiddleware.redirectIfAuthed, pageController.handleLoginSubmit)

pageRouter.get("/register", authMiddleware.redirectIfAuthed, pageController.showRegisterPage)
pageRouter.post("/register", authMiddleware.redirectIfAuthed, pageController.handleRegisterSubmit)

pageRouter.post("/logout", pageController.handleLogout)

pageRouter.get("/", authMiddleware.authPage, pageController.showHomePage)
pageRouter.post("/", authMiddleware.authPage, upload.single("resume"), pageController.handleGenerateReport)

pageRouter.get("/interview/:interviewId", authMiddleware.authPage, pageController.showInterviewPage)
pageRouter.post("/interview/:interviewId/resume/pdf", authMiddleware.authPage, pageController.handleDownloadResume)

module.exports = pageRouter
