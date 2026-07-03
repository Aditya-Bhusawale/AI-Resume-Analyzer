const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")
const tokenBlacklistModel = require("../models/blacklist.model")


function generateToken(user) {
    return jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
}

/**
 * @name registerUser
 * @description creates a new user account and returns the user along with a signed token.
 * Throws an Error with a `status` property on validation/conflict failures.
 */
async function registerUser({ username, email, password }) {

    if (!username || !email || !password) {
        const err = new Error("Please provide username, email and password")
        err.status = 400
        throw err
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [ { username }, { email } ]
    })

    if (isUserAlreadyExists) {
        const err = new Error("Account already exists with this email address or username")
        err.status = 400
        throw err
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = generateToken(user)

    return { user, token }
}

/**
 * @name loginUser
 * @description validates credentials and returns the user along with a signed token.
 * Throws an Error with a `status` property on invalid credentials.
 */
async function loginUser({ email, password }) {

    const user = await userModel.findOne({ email })

    if (!user) {
        const err = new Error("Invalid email or password")
        err.status = 400
        throw err
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        const err = new Error("Invalid email or password")
        err.status = 400
        throw err
    }

    const token = generateToken(user)

    return { user, token }
}

/**
 * @name logoutUser
 * @description blacklists the given token so it can no longer be used.
 */
async function logoutUser(token) {
    if (token) {
        await tokenBlacklistModel.create({ token })
    }
}

module.exports = { registerUser, loginUser, logoutUser }
