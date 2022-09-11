import Router from "express";
import { BookmarkController } from "../controllers/bookmark.controller";

const bookmarkRouter = Router();

//! get
bookmarkRouter.get(
  "/check/:fs_post_id/:useremail",
  BookmarkController.checkuserBookmark
);
bookmarkRouter.get(
  "/checkpost/:post_id/:useremail",
  BookmarkController.checkuserBookmarkpost
);
bookmarkRouter.get(
  "/fetchusbookpost/:useremail",
  BookmarkController.fetchuserBookmark
);
bookmarkRouter.get("/fetch/:fs_post_id", BookmarkController.fetchbookmarks);
bookmarkRouter.get("/fetchpost/:post_id/:useremail", BookmarkController.fetchbookmarkspost);
//! post
bookmarkRouter.post("/add", BookmarkController.addbookmark);
bookmarkRouter.post("/addpost", BookmarkController.addbookmarkpost);
//! delete
bookmarkRouter.delete(
  "/remove/:bookmark_id",
  BookmarkController.removebookmark
);

export { bookmarkRouter };
