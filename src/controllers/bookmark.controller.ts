import { getCustomRepository } from "typeorm";
import { BookmarkRespositiory } from "../databases/bookmark/repositiory/bookmark.repositiory";
import { Request, Response } from "express";

export class BookmarkController {
  static async addbookmark(req: Request, res: Response) {
    let bookmarkRepository = getCustomRepository(BookmarkRespositiory);
    await bookmarkRepository.addbookmark(req, res);
  }

  static async checkuserBookmark(req: Request, res: Response) {
    let bookmarkRepository = getCustomRepository(BookmarkRespositiory);
    await bookmarkRepository.checkuserBookmark(req, res);
  }

  static async fetchbookmarks(req: Request, res: Response) {
    let bookmarkRepository = getCustomRepository(BookmarkRespositiory);
    await bookmarkRepository.fetchbookmarks(req, res);
  }

  static async fetchuserBookmark(req: Request, res: Response) {
    let bookmarkRepository = getCustomRepository(BookmarkRespositiory);
    await bookmarkRepository.fetchuserBookmark(req, res);
  }

  

  static async removebookmark(req: Request, res: Response) {
    let bookmarkRepository = getCustomRepository(BookmarkRespositiory);
    await bookmarkRepository.removebookmark(req, res);
  }

  //! post

  static async addbookmarkpost(req: Request, res: Response) {
    let bookmarkRepository = getCustomRepository(BookmarkRespositiory);
    await bookmarkRepository.addbookmarkpost(req, res);
  }
  
  static async checkuserBookmarkpost(req: Request, res: Response) {
    let bookmarkRepository = getCustomRepository(BookmarkRespositiory);
    await bookmarkRepository.checkuserBookmarkpost(req, res);
  }

  static async fetchbookmarkspost(req: Request, res: Response) {
    let bookmarkRepository = getCustomRepository(BookmarkRespositiory);
    await bookmarkRepository.fetchbookmarkspost(req, res);
  }

}
