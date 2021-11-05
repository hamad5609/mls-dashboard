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

router.get('/', verify, async (req, res) => {
    try {
        const getPost = await Post.find();
        res.send(getPost);
    } catch (err) {
        res.send(err)
    }
})
router.post('/', verify, upload.array('postImage', 12), async (req, res) => {
    console.log(req.files);
    const imgFiles = req.files;
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
        res.send(err)
    }
})

module.exports = router;