const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            default: '',
        },
        iconClass: {
            type: String,
            default: 'fas fa-music',
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

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
