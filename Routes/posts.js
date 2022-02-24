import router from 'express';
import verify from './verifyToken.js';
import Post from '../Modules/postValue.js';
import multer from 'multer';
import path from "path";
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
});
const filterImage = (req, file, cb) => {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const upload = multer({ storage: storage, fileFilter: filterImage });

const Route = router.Router();

Route.get('/', async (req, res) => {
    try {
        const getPost = await Post.find();
        // const token = jwt.sign({ _id: user._id }, process.env.TOKEN_JSON);
        res.send(getPost);

    } catch (err) {
        res.status(400).send(err)
    }
})
Route.get('/porpertylist', async (req, res) => {
    const { page } = req.query;
    try {
        const Limit = 3;
        const startingIndex = (Number(page) - 1) * Limit;
        const total = await Post.countDocuments({});
        const numberOfPages = Math.ceil(total / Limit);
        const getPost = await Post.find().sort({ _id: -1 }).limit(Limit).skip(startingIndex);
        res.status(200).send({ data: getPost, currentPage: Number(page), numberOfPages: numberOfPages });

    } catch (err) {
        res.status(400).send(err)
    }
})
Route.get('/search', async (req, res) => {
    const { searchQuery, category, type, bath, city, price, area, bed } = req.query;
    try {
        const search = new RegExp(searchQuery, 'i');
        const Categories = new RegExp(category, 'i');
        const PropertyType = new RegExp(type, 'i');
        const postData = await Post.find({
            $and: [
                (search ? ({ address: search }) : {}),
                (Categories ? ({ category: Categories }) : {}),
                (PropertyType ? ({ propertyType: PropertyType }) : {}),
                (bath ? ({ bath: bath }) : {}),
                (city ? ({ city: city }) : {}),
                (price ? ({ price: { $gte: 0, $lte: Number(price) } }) : {}),
                (area ? ({ area: { $gte: 0, $lte: Number(area) } }) : {}),
                (bed ? ({ bed: bed }) : {}),
            ]
        });
        res.status(200).send({ data: postData });
    } catch (error) {
        res.status(404).send(err);
    }
})
Route.get('/:postId', async (req, res) => {
    try {
        const getpostById = await Post.findById(req.params.postId);
        res.send(getpostById)
    } catch (err) {
        res.status(400).send(err)
    }
})
Route.post('/', verify, upload.array("propertyImage", 12000), async (req, res) => {
    const imgFiles = req.files;
    const body = req.body;

    const post = new Post({
        ...body,
        propertyImage: imgFiles
    })
    console.log(body);
    try {
        const savePost = await post.save();

        res.send(savePost);
    } catch (err) {
        res.status(400).send(err)
    }
})
Route.patch('/:postId', upload.array("propertyImage", 12000), async (req, res) => {
    const _id = req.params.postId;
    const imgFiles = req.files;
    const body = req.body;
    console.log(req.userId);
    var post = {
        ...body,
        propertyImage: imgFiles,
    }
    try {
        const updatePost = await Post.findByIdAndUpdate(_id, post, { new: true });
        res.send(updatePost);
    } catch (err) {
        res.status(400).send(err)
    }
})

Route.delete('/:postId', upload.array("propertyImage", 12000), verify, async (req, res) => {
    // res.send(req.files)
    try {
        var imgFile = await Post.findById(req.params.postId);
        const removePost = await Post.remove({ _id: req.params.postId });
        imgFile.propertyImage.map((fileimg) => {
            let imgPath = path.join(__dirname, '../') + fileimg.path;
            console.log(imgPath)
            fs.unlinkSync(imgPath);
        });
        res.send(removePost);
        res.send(imgFile);
    } catch (err) {
        res.status(400).send(err)
    }
})


export default Route;