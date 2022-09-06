const postModel = require('../models/messages.models');
const userModel = require('../models/user.models');
const objectId = require('mongoose').Types.ObjectId;

module.exports.readPost = (req, res) => {
    postModel.find((err, docs) => {
        if (!err) res.send(docs);
        else console.log('Error to get data : ' + err);
    }).sort({ createdAt: -1 });
};

module.exports.createPost = async (req, res) => {
    const newPost = new postModel({
        posterId: req.body.posterId,
        posterPseudo: req.body.posterPseudo,
        posterAdmin: req.body.posterAdmin,
        message: req.body.message,
        video: req.body.video,
        likers: [],
        comments: [],
    });
    try {
        const post = await newPost.save();
        return res.status(201).json(post);
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.updatePost = (req, res, next) => {
    postModel.findOne({ _id: req.params.id })
        .then(postModel => {
            if (!postModel) {
                return res.status(401).json({ error });
            }
            userModel.findOne({ _id: req.auth.userId })
                .then(userModel => {
                    if (!userModel) {
                        return res.status(401).json({ error });
                    }
                    if (userModel.moderateur === true || postModel.userId === req.auth.userId) {
                        console.log("5")
                        const updateRecord = {
                            message: req.body.message
                        }
                        console.log("6")
                        postModel.update(
                            req.params.id,
                            { $set: updateRecord },
                            { new: true },
                            console.log("7"),
                            (err, docs) => {
                                if (!err) res.send(docs);
                                else console.log("Update error : " + err);
                            }
                        )
                    } else {
                        return res.status(403).send("unauthorized request");
                    }
                })
                .catch((error) => res.status(400).send({ error: "vous ne pouvez pas modifié ce message" }));
        })
};

module.exports.deletePost = (req, res, next) => {
    postModel.findOne({ _id: req.params.id })
        .then(postModel => {
            if (!postModel) {
                return res.status(401).json({ error });
            }
            userModel.findOne({ _id: req.auth.userId })
                .then(userModel => {
                    if (!userModel) {
                        return res.status(401).json({ error });
                    }
                    if (userModel.moderateur === true || postModel.userId === req.auth.userId) {
                        postModel.remove({ _id: req.params.id })
                            .then(() => res.status(200).json({ message: "message supprimé!" }))
                            .catch((error) => res.status(400).json({ error }));
                    } else {
                        return res.status(403).send("unauthorized request");
                    }
                })
                .catch((error) => res.status(400).send({ error: "vous ne pouvez pas effacer ce message" }));
        })
};

module.exports.like = (req, res, next) => {
    // on utilise le modele mangoose et findOne pour trouver un objet via la comparaison req.params.id
    postModel.findOne({ _id: req.params.id })
        //retourne une promesse avec reponse status 200 OK et l'élément en json
        .then((post) => {
            console.log('post', post)
            // définition de variables
            let valeurVote;
            let votant = req.body.userId;
            let like = post.usersLiked;
            let unlike = post.usersDisliked;
            // determine si l'utilisateur est dans un tableau
            let bon = like.includes(votant);
            let mauvais = unlike.includes(votant);
            // ce comparateur va attribuer une valeur de point en fonction du tableau dans lequel il est
            if (bon === true) {
                valeurVote = 1;
            } else if (mauvais === true) {
                valeurVote = -1;
            } else {
                valeurVote = 0;
            }
            console.log("bon", bon)
            console.log("mauvais", mauvais)
            console.log("valeur du vote", valeurVote)
            console.log("votant", votant)
            console.log("reqBodyLike", req.body.like)
            // ce comparateur va determiner le vote de l'utilisateur par rapport à une action de vote
            // si l'utilisateur n'a pas voté avant et vote positivement
            if (valeurVote === 0 && req.body.like === 1) {
                // ajoute 1 vote positif à likes
                post.likes += 1;
                console.log("A voter", post.likes)
                // le tableau usersLiked contiendra l'id de l'user
                post.usersLiked.push(votant);
                // si l'user a voté positivement et veut annuler son vote
            } else if (valeurVote === 1 && req.body.like === 0) {
                // enlève 1 vote positif
                post.likes -= 1;
                console.log("A voter", post.likes)
                // filtre/enlève l'id du votant du tableau usersLiked
                const nouveauUsersLiked = like.filter((f) => f != votant);
                // on actualise le tableau
                post.usersLiked = nouveauUsersLiked;
                // si l'user a voté négativement et veut annuler son vote
            } else if (valeurVote === -1 && req.body.like === 0) {
                // enlève un vote négatif
                post.dislikes -= 1;
                // filtre/enlève l'id du votant du tableau usersDisliked
                const nouveauUsersDisliked = unlike.filter((f) => f != votant);
                // on actualise le tableau
                post.usersDisliked = nouveauUsersDisliked;
                // si l'user n'a pas voté avant et vote négativement
            } else if (valeurVote === 0 && req.body.like === -1) {
                // ajoute 1 vote positif à unlikes
                post.dislikes += 1;
                // le tableau usersDisliked contiendra l'id de l'user
                post.usersDisliked.push(votant);
                // pour tout autre vote, il ne vient pas de l'index/front donc probabilité de tentative de vote illégal
            } else {
                console.log("tentavive de vote illégal");
            }
            console.log("le nombre de like final", post.likes)
            console.log("le nombre de dislike final", post.dislikes)
            postModel.updateOne(
                { _id: req.params.id },
                {
                    likes: post.likes,
                    dislikes: post.dislikes,
                    usersLiked: post.usersLiked,
                    usersDisliked: post.usersDisliked,
                }
            )
                // retourne une promesse avec status 200 et message en json
                .then(() => res.status(200).json({ message: "Vous venez de voter" }))
                // en cas d'erreur un status 400 et l'erreur en json
                .catch((error) => {
                    if (error) {
                        console.log(error);
                    }
                });
        })
        // si erreur envoit un status 404 Not Found et l'erreur en json
        .catch((error) => res.status(404).json({ error }));
};

///////////////////////////Comments/////////////////////////////

module.exports.commentPost = (req, res) => {
    if (!objectId.isValid(req.params.id))
        return res.status(400).send('ID inconnu : ' + req.params.id);

    try {
        console.log('req.body.commenterId', req.body)
        return postModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamps: new Date().getTime(),
                    },
                },
            },
            { new: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.editCommentPost = (req, res) => {
    if (!objectId.isValid(req.params.id))
        return res.status(400).send('ID inconnu : ' + req.params.id);

    try {
        return PostModel.findById(req.params.id, (err, docs) => {
            const theComment = docs.comments.find((comment) =>
                comment._id.equals(req.body.commentId)
            );

            if (!theComment) return res.status(404).send("Comment not found");
            theComment.text = req.body.text;

            return docs.save((err) => {
                if (!err) return res.status(200).send(docs);
                return res.status(500).send(err);
            });
        });
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.deleteCommentPost = (req, res) => {
    if (!objectId.isValid(req.params.id))
        return res.status(400).send('ID inconnu : ' + req.params.id);

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: {
                        _id: req.body.commentId,
                    },
                },
            },
            { new: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};