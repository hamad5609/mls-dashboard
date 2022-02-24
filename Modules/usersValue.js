import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        max: 255,
        min: 3
    },
    lastname: {
        type: String,
        required: true,
        max: 255,
        min: 3
    },
    name: {
        type: String,
        required: true,
        max: 255,
        min: 3
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    role: {
        type: String,
        default: 'USER_ROLE',
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const User = mongoose.model('User', userSchema);

export default User;