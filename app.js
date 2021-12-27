const express = require('express');
const app = express();
const UserRouter = require('./Routes/user');
const PostsRouter = require('./Routes/posts');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs')
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

app.delete('/uploads/:imgId', (req, res) => {
    console.log(req.params.imgId);
    try {
        fs.unlinkSync(`${__dirname}/uploads/${req.params.imgId}`)
        res.send("Image deleted");
    } catch (err) {
        res.status(400).send(err)
    }
})

app.delete('/multiupload', (req, res) => {
    console.log(req.files);
    // res.send(res);
    // try {
    //     _.map(yourArray,(files)=>{
    //         fs.unlinkSync(`${__dirname}/uploads/${req.params.imgId}`);
    //     });
    //     res.send("Image deleted");
    // } catch (err) {
    //     res.status(400).send(err)
    // }
})

mongoose.connect(process.env.DATA_BASE_AUTH, () => console.log('Database created'))


app.listen(PORT)