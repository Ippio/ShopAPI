const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

// const auth = async(req,res,next)=>{
//     const authHeader = req.headder.authentication
//     if(!authHeader && !authHeader.starsWith('Bearer')){
//         throw new UnauthenticatedError('No access')
//     }
//     const token = authHeader.split(' ')[1]

//     try {
//         const payload = jwt.verify(token,process.env.JWT_SECRET)

//         req.user = { userId: payload.userId, name: payload.name }
//         next()

//     } catch (error) {
//         throw new UnauthenticatedError('No access')
//     }
// }

const authenticateUser = (req, res, next) => {
    const token = req.signedCookies.token
    if (!token) {
        throw new UnauthenticatedError('No access')
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {...payload.user}
        next()
    } catch (error) {
        throw new UnauthenticatedError('No access')
    }
}

const authorizeRole = (...role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            throw new UnauthenticatedError('Unauthorized to access this route')
        }
        next()
    }
}

module.exports = { authenticateUser, authorizeRole };