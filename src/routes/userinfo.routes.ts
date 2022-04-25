import Router from "express";
import { UserInfoController } from "../controllers/userinfo.controller";

const userinfoRouter = Router();

//!post
userinfoRouter.post("/user/addinfo", UserInfoController.submitUserInfo);
//!get
userinfoRouter.get("/user/fecthallrewarduser/:useremail", UserInfoController.fetchallrewardpointbyuser);
//!update
// userinfoRouter.put("/user/updaterewardamout", UserInfoController.updateamountpoint);

export { userinfoRouter };
