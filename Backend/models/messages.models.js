const mongoose = require('mongoose');

const postSchemas = new mongoose.Schema(
    {
        posterId: { type: String, require: true },
        posterPseudo: { type: String, require: true },
        content: { type: String, trim: true, maxlength: 500 },
        picture: { type: String },
        likes: { type: Number, required: true, default: 0 },
        dislikes: { type: Number, required: true, default: 0 },
        usersLiked: { type: [String] },
        usersDisliked: { type: [String] },
        comments: {
            type: [
                {
                    commenterId: String,
                    posterPseudo: String,
                    text: String,
                    timestamp: Number,
                }
            ],
            require: true
        },
    },
    { timestamps: true, }
);

const PostModel = mongoose.model('post', postSchemas);
module.exports = PostModel;