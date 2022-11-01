interface Comment {
    commenterId: number;
    timestamp: string;
    text: string;
    posterPseudo: number;
    commenterPseudo: string;
    posterPicture: string;
  }
  
  
  export interface PostModel {
      postId: number;
      posterId: String,
      posterPseudo: String,
      content: String,
      picture: String,
      likes: number,
      dislikes: number,
      usersLiked: String[],
      usersDisliked: String[],
      isLiked?: Number;
      isDislike?: Number;
      date: string,
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
      timestamps: true,
  }

  