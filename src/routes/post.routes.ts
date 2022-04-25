import Router from "express";
import { PostController } from "../controllers/post.controller";

const postRouter = Router();
//!get
postRouter.get("/", PostController.fetchPost);
postRouter.get("/fetchpostrandomly", PostController.fetchPostrandomly);
postRouter.get("/fetchdetailpost/:post_id", PostController.fetchpostdetail);
postRouter.get("/fetchuserallpost/:useremail", PostController.fetchallPostbyuser);
postRouter.get("/fetchcommentpost/:post_id", PostController.fetchCommentpost);
//!post
postRouter.post("/addpost/:category_id", PostController.submitPost);
postRouter.post("/approveduserpost", PostController.isapprovedpost);
postRouter.post("/addviewpost", PostController.addviewpost);
export { postRouter };
