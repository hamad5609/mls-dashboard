const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    propertyImage: {
        type: Object,
        required: true,
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