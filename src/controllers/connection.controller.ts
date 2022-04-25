import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { ConnectionRepository } from "../databases/connetcions/repositiory/connection.repositiory";

export class ConnectionController {
  static async addConnection(req: Request, res: Response) {
    let connetionRepositiory = getCustomRepository(ConnectionRepository);
    await connetionRepositiory.addConnection(req, res);
  }
  static async fetchMyConnectiondata(req: Request, res: Response) {
    let connetionRepositiory = getCustomRepository(ConnectionRepository);
    await connetionRepositiory.fetchMyConnectiondata(req, res);
  }

  static async removeConnection(req: Request, res: Response) {
    let connetionRepositiory = getCustomRepository(ConnectionRepository);
    await connetionRepositiory.removeConnection(req, res);
  }

  static async checkIfConnected(req: Request, res: Response) {
    let connetionRepositiory = getCustomRepository(ConnectionRepository);
    await connetionRepositiory.checkIfConnected(req, res);
  }
  static async renderfollowers(req: Request, res: Response) {
    let connetionRepositiory = getCustomRepository(ConnectionRepository);
    await connetionRepositiory.renderfollowers(req, res);
  }
}
