const router = require('express').Router();
const verify = require('./verifyToken');
const Post = require('../Modules/postValue');
const multer = require('multer');
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
router.get('/:postId', verify, async (req, res) => {
    try {
        const getpostById = await Post.findById(req.params.postId);
        res.send(getpostById);
    } catch (err) {
        res.status(400).send(err)
    }
})
router.post('/', verify, upload.array("propertyImage", 12), async (req, res) => {
    const imgFiles = req.files;
    console.log(imgFiles);
    const post = new Post({
        propertyImage: imgFiles,
        address: req.body.address,
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
router.patch('/:postId', verify, upload.array("propertyImage", 12), verify, async (req, res) => {
    console.log(req.body);
    const imgFiles = req.files;
    var post = {
        propertyImage: imgFiles,
        address: req.body.address,
        bed: req.body.bed,
        bath: req.body.bath,
        garage: req.body.garage
    }
    try {
        const updatePost = await Post.updateOne({ _id: req.params.postId }, { $set: post });
        res.send(updatePost);
    } catch (err) {
        res.status(400).send(err)
    }
})
router.delete('/:postId', verify, async (req, res) => {
    try {
        const removePost = await Post.remove({ _id: req.params.postId });
        res.send(removePost);
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router;