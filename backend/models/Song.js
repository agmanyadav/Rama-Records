const mongoose = require('mongoose');

const songSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        artists: {
            type: String,
            required: true,
        },
        album: {
            type: String,
            default: 'Rama Records'
        },
        duration: {
            type: String,
            required: true,
        },
        coverImage: {
            type: String,
            required: true,
        },
        audioFile: {
            type: String,
            required: true,
        },
        dsps: {
            spotify: { type: String, default: '' },
            apple: { type: String, default: '' },
            youtube: { type: String, default: '' }
        },
        featured: {
            type: Boolean,
            default: false,
        },
        order: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
