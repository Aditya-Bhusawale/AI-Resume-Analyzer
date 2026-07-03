const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")



/**
 * @name authPage
 * @description same checks as authUser, but for server-rendered pages: redirects
 * to /login instead of returning a JSON error when the user isn't authenticated.
 */
async function authPage(req, res, next) {

    const token = req.cookies.token

    if (!token) {
        return res.redirect("/login")
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    })

    if (isTokenBlacklisted) {
        res.clearCookie("token")
        return res.redirect("/login")
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()

    } catch (err) {
        res.clearCookie("token")
        return res.redirect("/login")
    }

}

/**
 * @name redirectIfAuthed
 * @description for /login and /register pages: if the user already has a valid
 * session, skip straight to the home page instead of showing the auth form.
 */
async function redirectIfAuthed(req, res, next) {

    const token = req.cookies.token

    if (!token) {
        return next()
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    })

    if (isTokenBlacklisted) {
        return next()
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET)
        return res.redirect("/")
    } catch (err) {
        return next()
    }

}


module.exports = { authPage, redirectIfAuthed }