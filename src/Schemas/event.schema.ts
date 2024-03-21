import * as mongoose from 'mongoose';

export const eventSchema = new mongoose.Schema({
    eventTitle: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    eventDetails: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    eventType: {
        type: mongoose.Schema.Types.String,
        enum: ['Concerts', 'Online Events', 'Conferences', 'Corporate Events', 'Classes and Workshop', 'Festival & Fairs'],
        required: true
    },
    industry: {
        type: mongoose.Schema.Types.String,
        enum: ['Music', 'Performing Arts', 'Business', 'Technology'],
        required: true
    },
    slots: {
        type: mongoose.Schema.Types.Number,
        require: true
    },
    address: {
        type: mongoose.Schema.Types.String,
        require: true
    },
    city: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    country: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    tags: {
        type: mongoose.Schema.Types.Array,
    },
    startDate: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
    endDate: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
    // time: {
    //     type: mongoose.Schema.Types.String,
    //     required: true
    // },
    attendees: {
        type: mongoose.Schema.Types.Array
    },
    attendants: {
        type: mongoose.Schema.Types.Array
    },
    creator: {
        type: Object,
        ref: 'User'
    },
    reminder: {
        type: mongoose.Schema.Types.Date
    }
}, {timestamps: true})