import { getCustomRepository } from "typeorm";
import { Request,Response } from "express";
import { PostRepository } from "../databases/posts/repository/post.repository";

export class PostController {
    static async submitPost(req: Request, res: Response) {
      let subcategoryRepository = getCustomRepository(PostRepository);
      await subcategoryRepository.submitPost(req, res);
    }
    static async fetchPost(req: Request, res: Response) {
      let subcategoryRepository = getCustomRepository(PostRepository);
      await subcategoryRepository.fetchPost(req, res);
    }
    static async fetchPostbycateroyid(req: Request, res: Response) {
      let subcategoryRepository = getCustomRepository(PostRepository);
      await subcategoryRepository.fetchPostbycateroyid(req, res);
    }

    static async fetchpostuserBookmark(req: Request, res: Response) {
      let subcategoryRepository = getCustomRepository(PostRepository);
      await subcategoryRepository.fetchpostuserBookmark(req, res);
    }
    
    static async fetchdownloadsPostbyuser(req: Request, res: Response) {
      let subcategoryRepository = getCustomRepository(PostRepository);
      await subcategoryRepository.fetchdownloadsPostbyuser(req, res);
    }
    
    static async fetchpostuploaduserprofile(req: Request, res: Response) {
      let subcategoryRepository = getCustomRepository(PostRepository);
      await subcategoryRepository.fetchpostuploaduserprofile(req, res);
    }
    
    static async fetchpostdetail(req: Request, res: Response) {
      let subcategoryRepository = getCustomRepository(PostRepository);
      await subcategoryRepository.fetchpostdetail(req, res);
    }
    static async fetchallPostbyuser(req: Request, res: Response) {
      let subcategoryRepository = getCustomRepository(PostRepository);
      await subcategoryRepository.fetchallPostbyuser(req, res);
    }
    static async fetchCommentpost(req: Request, res: Response) {
      let subcategoryRepository = getCustomRepository(PostRepository);
      await subcategoryRepository.fetchCommentpost(req, res);
    }
    static async isapprovedpost(req: Request, res: Response) {
      let subcategoryRepository = getCustomRepository(PostRepository);
      await subcategoryRepository.isapprovedpost(req, res);
    }
    static async fetchFullPostappall(req: Request, res: Response) {
      let subcategoryRepository = getCustomRepository(PostRepository);
      await subcategoryRepository.fetchFullPostappall(req, res);
    }
    static async addviewpost(req: Request, res: Response) {
      let subcategoryRepository = getCustomRepository(PostRepository);
      await subcategoryRepository.addviewpost(req, res);
    }
    static async fetchPostrandomly(req: Request, res: Response) {
      let subcategoryRepository = getCustomRepository(PostRepository);
      await subcategoryRepository.fetchPostrandomly(req, res);
    }
    
  }