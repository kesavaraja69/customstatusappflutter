import Router from "express";
import { ViewsController } from "../controllers/views.controller";

const viewsRouter = Router();

//! get
viewsRouter.get("/fetch/:fs_post_id", ViewsController.fetchViews);
viewsRouter.get("/fetchpost/:post_id", ViewsController.fetchviewspost);
viewsRouter.get("/checkview/:useremail/:fs_post_id", ViewsController.checkuserView);
viewsRouter.get("/checkviewpost/:useremail/:post_id", ViewsController.checkuserViewpost);

//! post
viewsRouter.post("/add", ViewsController.addViews);
viewsRouter.post("/addpost", ViewsController.addViewspost);


export {viewsRouter};
