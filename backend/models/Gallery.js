const mongoose = require('mongoose');

const gallerySchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        imagePath: {
            type: String,
            required: true,
        },
        featured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
