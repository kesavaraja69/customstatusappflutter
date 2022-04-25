import Router from "express";
import { AuthenticationControllers } from "../controllers/authentication.controller";

const authenticationRouter = Router();

//!post
authenticationRouter.post("/user/create-new-account",AuthenticationControllers.createNewAccount);
authenticationRouter.post("/login",AuthenticationControllers.login);
//!get
authenticationRouter.get("/fecthtodayrewarduser/:useremail", AuthenticationControllers.fetchtodayrewardpointbyuser);
authenticationRouter.get("/fecthallrewarduser/:useremail", AuthenticationControllers.fetchallrewardpointbyuser);
authenticationRouter.get("/fetchfullscreencomments/:fs_post_id",AuthenticationControllers.fetchComment);
authenticationRouter.get("/fetchpostcomments/:post_id",AuthenticationControllers.fetchpostComment);
authenticationRouter.get("/loginverification",AuthenticationControllers.verifyjwtdata);
authenticationRouter.get("/checkuser/:useremail",AuthenticationControllers.checkUserData);
authenticationRouter.get("/fetchuser/:useremail",AuthenticationControllers.fetchUserData);
authenticationRouter.get("/fetchuserinfo/:useremail",AuthenticationControllers.fetchUserInfoData);
authenticationRouter.get("/fetchuserconnection/:user_email",AuthenticationControllers.fetchuserMyConnection);

//!update
authenticationRouter.put("/updaterewardamout", AuthenticationControllers.updateamountpoint);
authenticationRouter.put("/updatetodaypoint", AuthenticationControllers.updatetodaypoint);
authenticationRouter.put("/updaterewardlowpoint", AuthenticationControllers.updatewithlowamountpoint);

export { authenticationRouter };




