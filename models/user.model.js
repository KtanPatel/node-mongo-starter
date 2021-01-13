const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const constants = require('../utils/constants');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: constants.user.roles, default: constants.roles.user },
}, {
    timestamps: true,
    versionKey: false
});

UserSchema.pre('save', function save(next) {
    const user = this;
    if (!user.isModified('password')) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function comparePassword(plainPassword, next) {
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
        next(err, isMatch);
    });
}

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;