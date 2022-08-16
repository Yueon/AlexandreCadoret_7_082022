const mongoose = require('mongoose');

const postSchemas = new mongoose.Schema(
    {
        posterId: { type: String, require: true },
        message: { type: String, trim: true, maxlength: 500 },
        picture: { type: String },
        video: { type: String },
        likes: { type: Number, required: true, default: 0 },
        dislikes: { type: Number, required: true, default: 0 },
        usersLiked: { type: [String] },
        usersDisliked: { type: [String] },
        comment: {
            type: [
                {
                    commenterId: String,
                    commenterPseudo: String,
                    text: String,
                    timestamp: Number,
                }
            ],
            require: true
        },
    },
    { timestamp: true, }
);

module.exports = mongoose.model('post', postSchemas);