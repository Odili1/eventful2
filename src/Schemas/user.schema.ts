import * as mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        enum: ['event creator', 'attendee'],
        required: true
    },
    password: {
        type: String,
        required: true
    },
    eventeeReminder: {
        type: Date
    }
});