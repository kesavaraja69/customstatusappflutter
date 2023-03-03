import Router from 'express';
import { RewardController } from '../controllers/reward.controller';

const rewardRouter = Router();

//! post
rewardRouter.post('/addpoint', RewardController.adduserpoints);
//! get
rewardRouter.get(
  '/fetchuserpoints/:useremail',
  RewardController.fetchPostreward
);
//!delete
rewardRouter.delete(
  '/removeuserpoints/:useremail/:reward_id',
  RewardController.removerewardpoint
);

export { rewardRouter };
