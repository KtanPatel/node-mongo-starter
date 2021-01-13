const jwt = require('jsonwebtoken');
const UserModel = require("../models/user.model");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");
const environment = require("../utils/environment");

exports.signup = async (req, res) => {
    try {
        const {email, password, role, firstName, lastName} = req.body;
        const user = new UserModel({
            email, password, role, firstName, lastName
        });
        UserModel.findOne({ email }, (err, existingUser) => {
            if (err) { return sendErrorResponse(res, "Error in Register. Please try again later.") }
            if (existingUser) {
                return sendErrorResponse(res, 'Account with that email address already exists.', 400);
            }
            user.save((err) => {
                if (err) { return sendErrorResponse(res, "Error in register user data. Please try again later.") }
                return sendSuccessResponse(res, 'user register successfully');
            });
        });
    } catch (error) {
        sendErrorResponse(res, error.message)
    }
}

exports.login = async (req, res) => {
    try {
        res.clearCookie("token");
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email }).select("+password");

        if (!user) {
            return sendErrorResponse(res, "We are not aware of this user.", 403)
        }

        user.comparePassword(password, (err, isMatch) => {
            if (err) { return sendErrorResponse(res, 'Invalid email or password', 401) }
            if (isMatch) {
                const token = jwt.sign({ _id: user._id, role: user.role },
                    environment.jwt.secret,
                    { expiresIn: environment.jwt.expiredIn });

                const { password: hash, ...data } = user.toJSON();
                res.cookie("token", token);
                return sendSuccessResponse(res, {
                    message: 'Success! You are logged in.',
                    token,
                    data,
                })
            }
            return sendErrorResponse(res, 'Invalid email or password.', 401);
        });
    }
    catch (error) {
        sendErrorResponse(res, error.message)
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie("token");
        sendSuccessResponse(res, "User Logged out successfully!")
    } catch (error) {
        sendErrorResponse(res, error.message)
    }
}