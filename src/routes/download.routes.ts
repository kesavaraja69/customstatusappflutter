import Router from "express";
import { DownloadController } from "../controllers/download.controller";

const downloadRouter = Router();

//!get
downloadRouter.get("/fetch/:fs_post_id", DownloadController.fetchDownloads);
downloadRouter.get(
  "/fetchpost/:post_id",
  DownloadController.fetchDownloadspost
);
downloadRouter.get(
  "/checkdownload/:useremail/:fs_post_id",
  DownloadController.checkuserDownload
);
downloadRouter.get(
  "/checkdownloadpost/:useremail/:post_id",
  DownloadController.checkuserDownloadpost
);

//!post
downloadRouter.post("/add", DownloadController.addDownload);
downloadRouter.post("/addpost", DownloadController.addDownloadpost);

//!delete
downloadRouter.delete(
  "/delete/:download_id",
  DownloadController.removedownload
);

export { downloadRouter };
