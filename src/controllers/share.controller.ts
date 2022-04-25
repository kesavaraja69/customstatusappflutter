import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { ShareRepositiory } from "../databases/share/repositiory/share.repository";

export class ShareController {
  static async addshare(req: Request, res: Response) {
    let share = getCustomRepository(ShareRepositiory);
    await share.addshare(req, res);
  }
  static async fetchshare(req: Request, res: Response) {
    let share = getCustomRepository(ShareRepositiory);
    await share.fetchshare(req, res);
  }
  //! post
  static async addsharepost(req: Request, res: Response) {
    let share = getCustomRepository(ShareRepositiory);
    await share.addsharepost(req, res);
  }
  static async fetchsharepost(req: Request, res: Response) {
    let share = getCustomRepository(ShareRepositiory);
    await share.fetchsharepost(req, res);
  }
}
