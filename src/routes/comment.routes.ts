import Router from "express";
import { CommentController } from "../controllers/comment.controller";

const commentRouter = Router();
//! update
commentRouter.put("/update", CommentController.updateComment);
commentRouter.put("/updatepost", CommentController.updateCommentpost);
//! get
commentRouter.get("/fetchcomments/:fs_post_id", CommentController.fetchComment);
commentRouter.get(
  "/fetchcommentspost/:post_id",
  CommentController.fetchCommentpost
);
commentRouter.get(
  "/fetchusercomment/:fs_post_id/:useremail",
  CommentController.fetchCommentbyuser
);
commentRouter.get(
  "/fetchusercommentpost/:post_id/:useremail",
  CommentController.fetchCommentbyuserpost
);
//! post
commentRouter.post("/add", CommentController.addComment);
commentRouter.post("/addpost", CommentController.addCommentpost);
//! delete
commentRouter.delete(
  "/deletecomments/:comment_id",
  CommentController.deletcomment
);

export { commentRouter };
