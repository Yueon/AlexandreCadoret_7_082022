const mongoose = require('mongoose');

const postSchemas = new mongoose.Schema(
    {
        posterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        posterPseudo: { type: String, require: true },
        content: { type: String, trim: true, maxlength: 500 },
        picture: { type: String },
        likes: { type: Number, required: true, default: 0 },
        dislikes: { type: Number, required: true, default: 0 },
        isLiked: { type: Number, require: true, default: 0 },
        isDisliked: { type: Number, require: true, default: 0 },
        usersLiked: { type: [String] },
        usersDisliked: { type: [String] },
        comments: {
            type: [
                {
                    commenterId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'user',
                        required: true,
                    },
                    commenterPseudo: String,
                    commenterImage: String,
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