const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const { sendResponseWithCookie } = require('../utils/jwt')

const register = async (req, res) => {
    const { username, email, password } = req.body
    const user = await User.findOne({ username: username })
    if (user) {
        throw new BadRequestError('User already existed')
    }

    const newUser = await User.create({ ...req.body })
    // const token = newUser.createJWT()
    // res.status(StatusCodes.CREATED).json({ newUser: { username: newUser.username }, msg:'Register !!' ,token})
    sendResponseWithCookie(res, StatusCodes.CREATED, { id: newUser._id, username: newUser.username, role: newUser.role })
}

const login = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        throw new BadRequestError('Please provide username and password')
    }
    const user = await User.findOne({ username: username })
    if (!user) {
        throw new UnauthenticatedError('User does not existed')
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Wrong password')
    }

    // const token = user.createJWT()
    // res.cookie('LOGIN_INFO',token,{ maxAge:1000*60*60*24*30})
    // return res.status(StatusCodes.OK).json({ user: { username: user.username }, msg:'Login !!' ,token})

    sendResponseWithCookie(res, StatusCodes.OK,  { id: user._id, username: user.username, role: user.role })
}

const logout = async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(StatusCodes.OK).json({ msg: 'Logged out!' });
};


module.exports =
{
    register,
    login,
    logout
}
