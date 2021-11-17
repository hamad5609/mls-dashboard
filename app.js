const express = require('express');
const app = express();
const UserRouter = require('./Routes/user');
const PostsRouter = require('./Routes/posts');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
var PORT = process.env.PORT || 8000;
dotenv.config();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send("api home");
})
app.use('/user', UserRouter);
app.use('/post', PostsRouter);
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.DATA_BASE_AUTH, () => console.log('Database created'))


app.listen(PORT)