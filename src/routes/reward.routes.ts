import Router from "express";
import { RewardController } from "../controllers/reward.controller";

const rewardRouter = Router();

//! post
rewardRouter.post("/addpoint", RewardController.adduserpoints);
//! get
rewardRouter.get(
  "/fetchuserpoints/:useremail",
  RewardController.fetchPostreward
);
export { rewardRouter };
