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
import { amountRouter } from "./routes/amount.routes";
import { contactusRouter } from "./routes/contactus.routes";

createConnection(config as ConnectionOptions).then(async (connection) => {
  if (connection.isConnected) {
    console.log(`database is connected`);
  }

  const app = express();
  const port = process.env.PORT || 8282;
  app.use(cors());
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/api/users", authenticationRouter);
  app.use("/api/usersinfo", userinfoRouter);
  app.use("/api/categorys", categoryRouter);
  app.use("/api/subcategorys", subcategoryRouter);
  app.use("/api/fullscreenposts", fullscreenpostRouter);
  app.use("/api/posts", postRouter);
  app.use("/api/likes", likeRouter);
  app.use("/api/connetions", connectionRouter);
  app.use("/api/bookmark", bookmarkRouter);
  app.use("/api/download", downloadRouter);
  app.use("/api/comment", commentRouter);
  app.use("/api/share",shareRouter);
  app.use("/api/view",viewsRouter);
  app.use("/api/reward",rewardRouter);
  app.use("/api/userpayment",amountRouter);
  app.use("/api/contactusandreport",contactusRouter);

  app.set("port", port);
  app.listen(app.get("port"), () => {
    console.log(`server rocking at ${app.get("port")}`);
  });
});
