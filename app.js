import express from 'express';
import UserRouter from './Routes/user.js';
import PostsRouter from './Routes/posts.js';
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';

const app = express();
var PORT = process.env.PORT || 8000;
dotenv.config();
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: "true" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: "true" }));
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

mongoose.connect(process.env.DATA_BASE_AUTH, () => console.log(`Database created and running on ${PORT} port`))


app.listen(PORT)