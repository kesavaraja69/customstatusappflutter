import { Router } from "express";
import { ShareController } from "../controllers/share.controller";

const shareRouter = Router();

//! get
shareRouter.get("/fetch/:fs_post_id",ShareController.fetchshare);
shareRouter.get("/fetchpost/:post_id",ShareController.fetchsharepost);
//!post
shareRouter.post("/addfullscreenpost",ShareController.addshare);
shareRouter.post("/addpost",ShareController.addsharepost);
export { shareRouter };
