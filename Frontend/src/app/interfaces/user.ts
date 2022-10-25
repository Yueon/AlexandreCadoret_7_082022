export interface UserModel {
  _id: number;
  userId: number;
  pseudo: string;
  email: string;
  image: string;
  bio: string,
  date_deco: Date,
  moderateur: boolean;
}
