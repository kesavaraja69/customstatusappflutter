import { getCustomRepository } from 'typeorm';
import { Request, Response } from 'express';
import { FullScreenPostRepository } from '../databases/post_fullscreen/repository/postfullscreen.repository';

export class FullScreenVideoController {
  static async imagekitioupload(req: Request, res: Response) {
    let subcategoryRepository = getCustomRepository(FullScreenPostRepository);
    await subcategoryRepository.imagekitioupload(req, res);
  }

  static async fetchFullScreenPostwithlimit(req: Request, res: Response) {
    let subcategoryRepository = getCustomRepository(FullScreenPostRepository);
    await subcategoryRepository.fetchFullScreenPostwithlimit(req, res);
  }
  static async submitFullScreenPost(req: Request, res: Response) {
    let subcategoryRepository = getCustomRepository(FullScreenPostRepository);
    await subcategoryRepository.submitFullScreenPost(req, res);
  }
  static async fetchFullScreenPost(req: Request, res: Response) {
    let subcategoryRepository = getCustomRepository(FullScreenPostRepository);
    await subcategoryRepository.fetchFullScreenPost(req, res);
  }

  static async removefullscnpost(req: Request, res: Response) {
    let subcategoryRepository = getCustomRepository(FullScreenPostRepository);
    await subcategoryRepository.removefullscnpost(req, res);
  }

  static async fetchfullscreenuserBookmark(req: Request, res: Response) {
    let subcategoryRepository = getCustomRepository(FullScreenPostRepository);
    await subcategoryRepository.fetchfullscreenuserBookmark(req, res);
  }

  static async fetchdownloadsFullScreenPostbyuser(req: Request, res: Response) {
    let subcategoryRepository = getCustomRepository(FullScreenPostRepository);
    await subcategoryRepository.fetchdownloadsFullScreenPostbyuser(req, res);
  }

  static async fetchfullscreenuploaduserprofile(req: Request, res: Response) {
    let subcategoryRepository = getCustomRepository(FullScreenPostRepository);
    await subcategoryRepository.fetchfullscreenuploaduserprofile(req, res);
  }

  static async fetchFullScreenPostbycategoryid(req: Request, res: Response) {
    let subcategoryRepository = getCustomRepository(FullScreenPostRepository);
    await subcategoryRepository.fetchFullScreenPostbycategoryid(req, res);
  }
  static async fetchallFullScreenPost(req: Request, res: Response) {
    let subcategoryRepository = getCustomRepository(FullScreenPostRepository);
    await subcategoryRepository.fetchallFullScreenPost(req, res);
  }

  static async fetchFullScreenPostappall(req: Request, res: Response) {
    let subcategoryRepository = getCustomRepository(FullScreenPostRepository);
    await subcategoryRepository.fetchFullScreenPostappall(req, res);
  }

  static async fetchFullScreenPostallnotapproved(req: Request, res: Response) {
    let subcategoryRepository = getCustomRepository(FullScreenPostRepository);
    await subcategoryRepository.fetchFullScreenPostallnotapproved(req, res);
  }

  static async fetchFullScreenPostbyuser(req: Request, res: Response) {
    let subcategoryRepository = getCustomRepository(FullScreenPostRepository);
    await subcategoryRepository.fetchFullScreenPostbyuser(req, res);
  }

  static async fetchFullScreenPostDetailPage(req: Request, res: Response) {
    let subcategoryRepository = getCustomRepository(FullScreenPostRepository);
    await subcategoryRepository.fetchFullScreenPostDetailPage(req, res);
  }

  static async fetchComment(req: Request, res: Response) {
    let subcategoryRepository = getCustomRepository(FullScreenPostRepository);
    await subcategoryRepository.fetchComment(req, res);
  }

  static async isapprovedfullscreenpost(req: Request, res: Response) {
    let subcategoryRepository = getCustomRepository(FullScreenPostRepository);
    await subcategoryRepository.isapprovedfullscreenpost(req, res);
  }

  static async addviewfullscreenpost(req: Request, res: Response) {
    let subcategoryRepository = getCustomRepository(FullScreenPostRepository);
    await subcategoryRepository.addviewfullscreenpost(req, res);
  }
}
