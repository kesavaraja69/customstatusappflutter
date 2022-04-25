import { getCustomRepository } from "typeorm";
import { Request, Response } from "express";
import { RewardpointRepository } from "../databases/rewards/repositiory/reward.repositiory";

export class RewardController {
  //! post
  static async adduserpoints(req: Request, res: Response) {
    let rewardRepository = getCustomRepository(RewardpointRepository);
    await rewardRepository.adduserpoints(req, res);
  }

  static async fetchPostreward(req: Request, res: Response) {
    let rewardRepository = getCustomRepository(RewardpointRepository);
    await rewardRepository.fetchPostreward(req, res);
  }
}
