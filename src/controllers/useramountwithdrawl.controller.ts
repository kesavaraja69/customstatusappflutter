import { getCustomRepository } from "typeorm";
import { Request, Response } from "express";
import { AmountRepository } from "../databases/rewards/repositiory/amount.repository";

export class UserAmountWithdrawalController {
    //! post
    static async adduseramount(req: Request, res: Response) {
      let rewardRepository = getCustomRepository(AmountRepository);
      await rewardRepository.adduseramount(req, res);
    }
  
    static async fetchallrewardamountbyuser(req: Request, res: Response) {
      let rewardRepository = getCustomRepository(AmountRepository);
      await rewardRepository.fetchallrewardamountbyuser(req, res);
    }
  }