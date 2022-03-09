import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    propertyImage: {
        type: [Object],
        default: [],
    },
    user: { type: Object, immutable: true },
    title: {
        type: String,
        required: true,
        max: 255,
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
    },
    country: {
        type: String,
    },
    countryState: {
        type: String,
    },
    propertyType: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    area: {
        type: String,
        required: true,
    },
    bed: {
        type: String,
        required: true,
    },
    bath: {
        type: String,
        required: true,
    },
    garage: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});

const Post = mongoose.model('Post', postSchema);

export default Post;