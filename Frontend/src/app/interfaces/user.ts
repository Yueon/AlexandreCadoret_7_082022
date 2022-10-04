export interface UserModel {
  userId: number;
  pseudo: string;
  email: string;
  image: string;
  bio: string,
  date_deco: Date,
  moderateur: boolean;
}
