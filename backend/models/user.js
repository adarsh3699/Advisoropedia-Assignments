const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    id: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profilePicture: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: false },
    verified: { type: Boolean, required: true },
    linkWithGoogle: { type: Boolean, required: true },
    linkWithPassword: { type: Boolean, required: true },
    createdOn: { type: Date, required: true },
});

module.exports = mongoose.model('User', userSchema);
