const express = require('express');
const app = express();
const UserRouter = require('./Routes/user');
const PostsRouter = require('./Routes/posts');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Api Home');
})
app.use('/user', UserRouter);
app.use('/post', PostsRouter);
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.DATA_BASE_AUTH, () => console.log('Database created'))


app.listen(8000)