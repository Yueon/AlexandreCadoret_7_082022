const router = require('express').Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const postController = require('../controllers/messages.controllers');

router.get('/', auth, postController.readPost);
router.get('/:id', auth, postController.getOnePost);
router.post('/', auth, multer, postController.createPost);
router.put('/:id', auth, multer, postController.updatePost);
router.delete('/:id', auth, postController.deletePost);
router.post("/:id/like", auth, postController.like)

//comments
router.patch('/comment-post/:id', auth, postController.commentPost);
router.patch('/delete-comment-post/:id', auth, postController.deleteCommentPost);


module.exports = router;