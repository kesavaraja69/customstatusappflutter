import { getCustomRepository } from "typeorm";
import { Request, Response } from "express";
import { LikeRepositiory } from "../databases/likes/repositiory/like.repositiory";

export class LikeController {
  //! fullscreen post
  static async addLikes(req: Request, res: Response) {
    let likeRepository = getCustomRepository(LikeRepositiory);
    await likeRepository.addLikes(req, res);
  }
  static async fetchLikes(req: Request, res: Response) {
    let likeRepository = getCustomRepository(LikeRepositiory);
    await likeRepository.fetchLikes(req, res);
  }
  static async removelike(req: Request, res: Response) {
    let likeRepository = getCustomRepository(LikeRepositiory);
    await likeRepository.removelike(req, res);
  }
  static async checkuserLike(req: Request, res: Response) {
    let likeRepository = getCustomRepository(LikeRepositiory);
    await likeRepository.checkuserLike(req, res);
  }
  //! post
  static async addLikespost(req: Request, res: Response) {
    let likeRepository = getCustomRepository(LikeRepositiory);
    await likeRepository.addLikespost(req, res);
  }
  static async checkuserLikepost(req: Request, res: Response) {
    let likeRepository = getCustomRepository(LikeRepositiory);
    await likeRepository.checkuserLikepost(req, res);
  }
  static async fetchLikespost(req: Request, res: Response) {
    let likeRepository = getCustomRepository(LikeRepositiory);
    await likeRepository.fetchLikespost(req, res);
  }
  
}
