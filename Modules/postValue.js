const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    propertyImage: {
        type: Object,
        required: true,
    },
    title: {
        type: String,
        required: true,
        max: 255,
        min: 3
    },
    price: {
        type: String,
        required: true,
        max: 255,
        min: 3
    },
    description: {
        type: String,
        required: true,
        min: 3
    },
    city: {
        type: String,
        // required: true,
        min: 3
    },
    country: {
        type: Object,
        // required: true,
        min: 3
    },
    countryState: {
        type: String,
        // required: true,
        min: 3
    },
    purpose: {
        type: String,
        required: true,
        min: 3
    },
    category: {
        type: String,
        required: true,
        min: 3
    },
    address: {
        type: String,
        required: true,
        max: 255,
        min: 3
    },
    bed: {
        type: String,
        required: true,
        max: 255,
        min: 3
    },
    bath: {
        type: String,
        required: true,
        max: 1024,
        min: 3
    },
    garage: {
        type: String,
        required: true,
        max: 1024,
        min: 3
    },
});

module.exports = mongoose.model('Post', postSchema);