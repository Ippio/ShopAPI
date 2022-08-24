const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError,NotFoundError } = require('../errors')

// Protected Route
// GET LIST User  =>    GET /User

const getListUser = async (req, res) => {

    const page = Number(req.query.page) || 1
    const limit = 32
    const skip = (page - 1) * limit

    const users = User.find({},'',{
        projection:{
            password:0
        }
    }).sort('-createdAt').skip(skip).limit(limit)
    const totalUser = users.clone().countDocuments()
    const data={
        users:await users,
        totalUser: await totalUser,
        currentPage:page
    }
    res.status(StatusCodes.OK).json({error: false, data: data})
}

// Public Route 
// Get User  =>    POST /User/:id

const getUser = async (req, res) => {
    const {id} = req.params
    const user = User.findOne({_id:id})

    if (!user) {
        throw new NotFoundError(`No User with id : ${id}`);
    }

    res.status(StatusCodes.OK).json({error: false ,User: user })
}


// Protected Route / Admin Only
// Update User  =>    PATCH /User/:id

const updateUser = async (req, res) => {
    const { id:UserId } = req.params;
    const user = await User.findOneAndUpdate({ _id: UserId }, req.body , {
        new: true,
        runValidators: true,
    });
    const saveUser = await user.save()
    if (!user) {
        throw new NotFoundError(`No User with id : ${UserId}`);
    }
    res.status(StatusCodes.OK).json({ error:false, user : saveUser });
};

// Protected Route / Admin Only
// Delete User =>    DELETE /User/:id

const deleteUser = async (req, res) => {
    const { id } = req.params;

    const user = await User.findOne({ _id: id });

    if (!user) {
        throw new NotFoundError(`No User with id : ${UserId}`);
    }

    user.remove();
    res.status(StatusCodes.OK).json({ msg: 'success! User removed' });

}

const searchUser = async (req, res) => {
    const key = req.params.key.trim()
    const users = await User.find({ username: { $regex: new RegExp('^' + key + '.*', 'i') } }).limit(32)
    if (users.length === 0) throw new BadRequestError('There is no user')
    res.status(StatusCodes.OK).json({ error: false, users: users })
}


module.exports = {
    getListUser,
    getUser,
    updateUser,
    deleteUser,
    searchUser,
}
