import Router from "express";
import { LikeController } from "../controllers/like.controller";

const likeRouter = Router();

//! get
likeRouter.get("/fetch/:fs_post_id", LikeController.fetchLikes);
likeRouter.get("/fetchpost/:post_id", LikeController.fetchLikespost);
likeRouter.get("/checklike/:useremail/:fs_post_id", LikeController.checkuserLike);
likeRouter.get("/checklikepost/:useremail/:post_id", LikeController.checkuserLikepost);

//! post
likeRouter.post("/add", LikeController.addLikes);
likeRouter.post("/addpost", LikeController.addLikespost);

//! delete
likeRouter.delete("/delete/:like_id", LikeController.removelike);

export { likeRouter };
