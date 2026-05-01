const mongoose = require('mongoose');

const releaseSchema = new mongoose.Schema({
    youtubeUrl: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        default: '',
    },
}, {
    timestamps: true
});

const Release = mongoose.model('Release', releaseSchema);

module.exports = Release;
