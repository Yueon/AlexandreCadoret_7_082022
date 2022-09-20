interface Comment {
    commenterId: number;
    commentDate: string;
    commentContent: string;
    posterPseudo: number;
    commenterPseudo: string;
    posterPicture: string;
  }
  
  interface Likes {
    LikesNumber: number;
    DislikesNumber: number;
    currentUserReaction: number;
  }
  
  
  export interface Post {
    postId: number;
    postDate: string;
    postContent: string;
    postPicture: string;
    posterId: number;
    posterPseudo: string;
    posterPicture: string;
    likes: Likes;
    comments: [Comment];
  }

  