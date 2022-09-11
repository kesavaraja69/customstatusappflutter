import { getCustomRepository } from "typeorm";
import { Request, Response } from "express";
import { DownloadRepositiory } from "../databases/downloads/repository/download.repositiory";

export class DownloadController {
  static async addDownload(req: Request, res: Response) {
    let downloadRepository = getCustomRepository(DownloadRepositiory);
    await downloadRepository.addDownload(req, res);
  }
  static async checkuserDownload(req: Request, res: Response) {
    let downloadRepository = getCustomRepository(DownloadRepositiory);
    await downloadRepository.checkuserDownload(req, res);
  }
  static async fetchDownloads(req: Request, res: Response) {
    let downloadRepository = getCustomRepository(DownloadRepositiory);
    await downloadRepository.fetchDownloads(req, res);
  }
  static async removedownload(req: Request, res: Response) {
    let downloadRepository = getCustomRepository(DownloadRepositiory);
    await downloadRepository.removedownload(req, res);
  }
  
  static async fetchDownloadsbyuser(req: Request, res: Response) {
    let downloadRepository = getCustomRepository(DownloadRepositiory);
    await downloadRepository.fetchDownloadsbyuser(req, res);
  }

  //! post
  static async addDownloadpost(req: Request, res: Response) {
    let downloadRepository = getCustomRepository(DownloadRepositiory);
    await downloadRepository.addDownloadpost(req, res);
  }

  static async fetchpostDownloadsbyuser(req: Request, res: Response) {
    let downloadRepository = getCustomRepository(DownloadRepositiory);
    await downloadRepository.fetchpostDownloadsbyuser(req, res);
  }

  static async checkuserDownloadpost(req: Request, res: Response) {
    let downloadRepository = getCustomRepository(DownloadRepositiory);
    await downloadRepository.checkuserDownloadpost(req, res);
  }

  static async fetchDownloadspost(req: Request, res: Response) {
    let downloadRepository = getCustomRepository(DownloadRepositiory);
    await downloadRepository.fetchDownloadspost(req, res);
  }
}
