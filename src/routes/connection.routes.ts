import Router from "express";
import { ConnectionController } from "../controllers/connection.controller";

const connectionRouter = Router();

//!post
connectionRouter.post("/add", ConnectionController.addConnection);

//!get
connectionRouter.get("/loggeduserconnections/:user_email", ConnectionController.fetchMyConnectiondata);
connectionRouter.get("/checkconnections/:from_connection_email/:to_connection_email", ConnectionController.checkIfConnected);
connectionRouter.get("/fectchfollowers/:to_useremail", ConnectionController.renderfollowers);

//!delete
connectionRouter.delete("/removeuserconnections", ConnectionController.removeConnection);


export { connectionRouter };
