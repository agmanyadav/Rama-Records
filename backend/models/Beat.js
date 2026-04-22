const mongoose = require('mongoose');

const beatSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: String, // e.g., "$50"
            default: '',
        },
        audioFile: {
            type: String,
            required: true,
        },
        coverImage: {
            type: String,
            required: true,
        },
        tags: {
            type: String,
            default: '',
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

const Beat = mongoose.model('Beat', beatSchema);

module.exports = Beat;
