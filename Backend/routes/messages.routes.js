const router = require('express').Router();
const auth = require("../middleware/auth");
const postController = require('../controllers/messages.controllers');

router.get('/', auth, postController.readPost);
router.post('/', auth, postController.createPost);
router.put('/:id', auth, postController.updatePost);
router.delete('/:id', auth, postController.deletePost);
router.post("/:id/like", auth, postController.like)

module.exports = router;