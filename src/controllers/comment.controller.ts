import { getCustomRepository } from "typeorm";
import { Request, Response } from "express";
import { CommentRepositiory } from "../databases/comments/repository/comment.repositiory";

export class CommentController {
  static async addComment(req: Request, res: Response) {
    let commentRepository = getCustomRepository(CommentRepositiory);
    await commentRepository.addComment(req, res);
  }
  static async fetchComment(req: Request, res: Response) {
    let commentRepository = getCustomRepository(CommentRepositiory);
    await commentRepository.fetchComment(req, res);
  }

  static async deletcomment(req: Request, res: Response) {
    let commentRepository = getCustomRepository(CommentRepositiory);
    await commentRepository.deletcomment(req, res);
  }

  static async updateComment(req: Request, res: Response) {
    let commentRepository = getCustomRepository(CommentRepositiory);
    await commentRepository.updateComment(req, res);
  }

  static async fetchCommentbyuser(req: Request, res: Response) {
    let commentRepository = getCustomRepository(CommentRepositiory);
    await commentRepository.fetchCommentbyuser(req, res);
  }

  //! post
  static async addCommentpost(req: Request, res: Response) {
    let commentRepository = getCustomRepository(CommentRepositiory);
    await commentRepository.addCommentpost(req, res);
  }

  static async updateCommentpost(req: Request, res: Response) {
    let commentRepository = getCustomRepository(CommentRepositiory);
    await commentRepository.updateCommentpost(req, res);
  }

  static async fetchCommentpost(req: Request, res: Response) {
    let commentRepository = getCustomRepository(CommentRepositiory);
    await commentRepository.fetchCommentpost(req, res);
  }

  static async fetchCommentbyuserpost(req: Request, res: Response) {
    let commentRepository = getCustomRepository(CommentRepositiory);
    await commentRepository.fetchCommentbyuserpost(req, res);
  }

}
