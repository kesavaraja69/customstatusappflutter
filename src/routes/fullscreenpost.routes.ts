import Router from "express";
import { FullScreenVideoController } from "../controllers/fullscreenvideo.controller";

const fullscreenpostRouter = Router();
//!get
fullscreenpostRouter.get("/", FullScreenVideoController.fetchFullScreenPost);
fullscreenpostRouter.get("/withlimit/:count", FullScreenVideoController.fetchFullScreenPostwithlimit);

fullscreenpostRouter.get("/all/:sub_category_id/:parent_category_id", FullScreenVideoController.fetchallFullScreenPost);
fullscreenpostRouter.get("/allfullscreenpost/:useremail", FullScreenVideoController.fetchFullScreenPostbyuser);
fullscreenpostRouter.get("/fullscreenpostdetail/:detail_id", FullScreenVideoController.fetchFullScreenPostDetailPage);
fullscreenpostRouter.get("/allfullscreenpostcomment/:fs_post_id", FullScreenVideoController.fetchComment);
//!post
fullscreenpostRouter.post("/addfullscreenvideo/:category_id", FullScreenVideoController.submitFullScreenPost);
fullscreenpostRouter.post("/fullscreenvideoapprovel", FullScreenVideoController.isapprovedfullscreenpost);
fullscreenpostRouter.post("/addfullscreenvideoview", FullScreenVideoController.addviewfullscreenpost);
export { fullscreenpostRouter };