const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const remindSchema = new Schema({
    userID: {
        type: String,
        required: true
    },

    dm: {
        type: Boolean,
        default: false,
        required: true
    },
    guild: {
        type: String,
        required: true,

    },
    channel: {
        type: String,
        required: true,
    },

    message: {
        type: String
    },
    date: {
        type: Date,
        required: true
    }
    // Is reminded?
    // Type Bool
}, {
    timestamps: true
});

module.exports = model('remind', remindSchema);