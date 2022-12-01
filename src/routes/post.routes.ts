import Router from "express";
import { PostController } from "../controllers/post.controller";

const postRouter = Router();
//!get
postRouter.get("/", PostController.fetchPost);
postRouter.get("/fetachpostbycategory/:parent_category_id", PostController.fetchPostbycateroyid);
postRouter.get("/fetchpostrandomly", PostController.fetchPostrandomly);
postRouter.get("/fetchdetailpost/:post_id", PostController.fetchpostdetail);
postRouter.get("/fetchdetailpostupldprofile/:post_id", PostController.fetchpostuploaduserprofile);

postRouter.get("/fetchuserallappposts/:isapproved", PostController.fetchFullPostappall);
postRouter.get("/fetchuserallposts/:useremail", PostController.fetchallPostbyuser);
postRouter.get("/fetchuserallpostbokmark/:useremail", PostController.fetchpostuserBookmark);
postRouter.get("/fetchuserallpostdownloads/:useremail", PostController.fetchdownloadsPostbyuser);

postRouter.get("/fetchcommentpost/:post_id", PostController.fetchCommentpost);
//!post
postRouter.post("/addpost/:category_id", PostController.submitPost);


//! update
postRouter.put("/approveduserpost", PostController.isapprovedpost);
postRouter.put("/addviewpost", PostController.addviewpost);
export { postRouter };
