const fs = require("fs");
const path = require("path");
const baseUrl = '';
exports.removeFile = (fileName) => {
    return new Promise((resolve, reject) => {
        fs.unlink(path.join(baseUrl, fileName), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(fileName);
            }
        });
    })
} 

exports.getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? (page - 1) * limit : 0;

    return { limit, offset };
};

exports.getPaginationData = (data, page, limit) => {
    const { count: totalItems, docs } = data;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);

    return { data: docs, ...(limit ? { pagination: { totalItems, totalPages, currentPage, pageSize: limit } } : {}) };
}

exports.getCount = async (Model, condition = null) => {
    if(condition){
        return await Model.countDocuments(condition);
    }
    return await Model.estimatedDocumentCount();
}