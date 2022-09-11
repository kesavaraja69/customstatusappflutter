import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UserInfoRepository } from "../databases/usersinfo/repository/info.userrepository";

export class UserInfoController {
  static async submitUserInfo(req: Request, res: Response) {
    let userinfoRepository = getCustomRepository(UserInfoRepository);
    await userinfoRepository.submitUserInfo(req, res);
  }

  static async fetchallrewardpointbyuser(req: Request, res: Response) {
    let userinfoRepository = getCustomRepository(UserInfoRepository);
    await userinfoRepository.fetchallrewardpointbyuser(req, res);
  }

  static async updateuserProfile(req: Request, res: Response) {
    let userinfoRepository = getCustomRepository(UserInfoRepository);
    await userinfoRepository.updateuserProfile(req, res);
  }
  
  // static async updateamountpoint(req: Request, res: Response) {
  //   let userinfoRepository = getCustomRepository(UserInfoRepository);
  //   await userinfoRepository.updateamountpoint(req, res);
  // }
}
