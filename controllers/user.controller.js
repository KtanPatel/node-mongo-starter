const UserModel = require("../models/user.model");
const { getPagination, getCount, getPaginationData } = require("../utils/fn");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");

exports.me = async (req, res) => {
    try {
        const { _id: userId } = req.user;
        const user = await UserModel.findById(userId).lean();
        sendSuccessResponse(res, { data: user });
    } catch (error) {
        sendErrorResponse(res, error.message);
    }
}

exports.findAll = async (req, res) => {
    try {
        const { page, size } = req.query;
        const { limit, offset } = getPagination(page, size);
        const count = await getCount(UserModel);
        const users = await UserModel.find({})
            .skip(offset)
            .limit(limit)
            .lean();

        sendSuccessResponse(res, getPaginationData({ count, docs: users }, page, limit))

    } catch (error) {
        sendErrorResponse(res, error.message);
    }
}

exports.updateById = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, role, firstName, lastName } = req.body;
        const request = {
            ...(email ? { email } : {}),
            ...(role ? { role } : {}),
            ...(firstName ? { firstName } : {}),
            ...(lastName ? { lastName } : {}),
        };
        const user = await UserModel.findByIdAndUpdate(id, {
            ...request
        }, { new: true }).lean();
        sendSuccessResponse(res, { data: user })
    } catch (error) {
        sendErrorResponse(res, error.message);
    }
}