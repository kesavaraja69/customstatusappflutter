import { getCustomRepository } from "typeorm";
import { Request, Response } from "express";
import { ViewsRepository } from "../databases/views/repository/views.repository";

export class ViewsController {
  //! fullscreen post
  static async addViews(req: Request, res: Response) {
    let viewRepository = getCustomRepository(ViewsRepository);
    await viewRepository.addViews(req, res);
  }
  static async fetchViews(req: Request, res: Response) {
    let viewRepository = getCustomRepository(ViewsRepository);
    await viewRepository.fetchViews(req, res);
  }
  static async checkuserView(req: Request, res: Response) {
    let viewRepository = getCustomRepository(ViewsRepository);
    await viewRepository.checkuserView(req, res);
  }
  //! post
  static async addViewspost(req: Request, res: Response) {
    let viewRepository = getCustomRepository(ViewsRepository);
    await viewRepository.addViewspost(req, res);
  }
  static async checkuserViewpost(req: Request, res: Response) {
    let viewRepository = getCustomRepository(ViewsRepository);
    await viewRepository.checkuserViewpost(req, res);
  }
  static async fetchviewspost(req: Request, res: Response) {
    let viewRepository = getCustomRepository(ViewsRepository);
    await viewRepository.fetchviewspost(req, res);
  }
}
