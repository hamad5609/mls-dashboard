const router = require('express').Router();
const verify = require('./verifyToken');
const Post = require('../Modules/postValue');
const multer = require('multer');
const path = require("path");
const fs = require('fs');
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

router.get('/', async (req, res) => {
    try {
        const getPost = await Post.find();
        // const token = jwt.sign({ _id: user._id }, process.env.TOKEN_JSON);
        res.send(getPost);

    } catch (err) {
        res.status(400).send(err)
    }
})
router.get('/porpertylist', async (req, res) => {
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
router.get('/search', async (req, res) => {
    const { searchQuery, bath, city, price, area, bed } = req.query;
    try {
        const search = new RegExp(searchQuery, 'i');
        const postData = await Post.find({
            $and: [
                (search ? ({ address: search }) : {}),
                (bath ? ({ bath: bath }) : {}),
                (city ? ({ city: city }) : {}),
                (price ? ({ price: price }) : {}),
                (area ? ({ area: area }) : {}),
                (bed ? ({ bed: bed }) : {}),
            ]
        });
        res.status(200).send({ data: postData });
    } catch (error) {
        res.status(404).send(err);
    }
})
router.get('/:postId', async (req, res) => {
    try {
        const getpostById = await Post.findById(req.params.postId);
        res.send(getpostById);
    } catch (err) {
        res.status(400).send(err)
    }
})
router.post('/', verify, upload.array("propertyImage", 12000), async (req, res) => {
    const imgFiles = req.files;
    console.log(imgFiles);
    const post = new Post({
        propertyImage: imgFiles,
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        city: req.body.city,
        country: req.body.country,
        countryState: req.body.countryState,
        purpose: req.body.purpose,
        category: req.body.category,
        address: req.body.address,
        area: req.body.area,
        bed: req.body.bed,
        bath: req.body.bath,
        garage: req.body.garage
    })
    try {
        const savePost = await post.save();
        res.send(savePost);
    } catch (err) {
        res.status(400).send(err)
    }
})
router.patch('/:postId', upload.array("propertyImage", 12000), verify, async (req, res) => {
    var editPost = await Post.findById(req.params.postId)
    console.log(editPost);
    console.log(req.files);
    const imgFiles = req.files;
    var post = {
        propertyImage: imgFiles,
        title: req.body.title,
        price: req.body.price,
        city: req.body.city,
        country: req.body.country,
        countryState: req.body.countryState,
        purpose: req.body.purpose,
        category: req.body.category,
        description: req.body.description,
        address: req.body.address,
        area: req.body.area,
        bed: req.body.bed,
        bath: req.body.bath,
        garage: req.body.garage
    }
    try {
        const updatePost = await Post.updateOne({ _id: req.params.postId }, { $set: post });
        res.send(updatePost);
        // res.send(editPost);
    } catch (err) {
        res.status(400).send(err)
    }
})

router.delete('/:postId', upload.array("propertyImage", 12000), verify, async (req, res) => {
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


module.exports = router;