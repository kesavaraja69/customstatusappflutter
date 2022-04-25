import express from "express";
import cors from "cors";
import "reflect-metadata";
import { authenticationRouter } from "./routes/authentication.routes";
import { ConnectionOptions, createConnection } from "typeorm";
import config from "./ormconfig";
import { userinfoRouter } from "./routes/userinfo.routes";
import { categoryRouter } from "./routes/category.routes";
import { subcategoryRouter } from "./routes/subcategory.routes";
import { fullscreenpostRouter } from "./routes/fullscreenpost.routes";
import { postRouter } from "./routes/post.routes";
import { connectionRouter } from "./routes/connection.routes";
import { likeRouter } from "./routes/likes.routes";
import { bookmarkRouter } from "./routes/bookmark.routes";
import { downloadRouter } from "./routes/download.routes";
import { commentRouter } from "./routes/comment.routes";
import { shareRouter } from "./routes/share.routes";
import { viewsRouter } from "./routes/views.routes";
import { rewardRouter } from "./routes/reward.routes";

createConnection(config as ConnectionOptions).then(async (connection) => {
  if (connection.isConnected) {
    console.log(`database is connected`);
  }

  const app = express();
  const port = process.env.PORT || 8282;
  app.use(cors());
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/users", authenticationRouter);
  app.use("/usersinfo", userinfoRouter);
  app.use("/categorys", categoryRouter);
  app.use("/subcategorys", subcategoryRouter);
  app.use("/fullscreenposts", fullscreenpostRouter);
  app.use("/posts", postRouter);
  app.use("/likes", likeRouter);
  app.use("/connetions", connectionRouter);
  app.use("/bookmark", bookmarkRouter);
  app.use("/download", downloadRouter);
  app.use("/comment", commentRouter);
  app.use("/share",shareRouter);
  app.use("/view",viewsRouter);
  app.use("/reward",rewardRouter);

  app.set("port", port);
  app.listen(app.get("port"), () => {
    console.log(`server rocking at ${app.get("port")}`);
  });
});
