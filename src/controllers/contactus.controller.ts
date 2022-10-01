import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { ContactusRepository } from "../databases/contactus/repo/contactus.repo";

export class ContactusContoller {

    static async adduserreportandcontactus(req: Request, res: Response) {
        let contactusrep = getCustomRepository(ContactusRepository);
        await contactusrep.adduserreportandcontactus(req, res);
    }
    static async fetchuserreportandcontactus(req: Request, res: Response) {
        let contactusrep = getCustomRepository(ContactusRepository);
        await contactusrep.fetchuserreportandcontactus(req, res);
    }
    static async fetchuserreportorcontactus(req: Request, res: Response) {
        let contactusrep = getCustomRepository(ContactusRepository);
        await contactusrep.fetchuserreportorcontactus(req, res);
    }
    
}