import { Router } from "express";
import { ContactusContoller } from "../controllers/contactus.controller";

const contactusRouter = Router();

//! post 
contactusRouter.post("/addcontactusandreport", ContactusContoller.adduserreportandcontactus)

//! get
contactusRouter.get("/fetchcontactusandreport", ContactusContoller.fetchuserreportandcontactus)
contactusRouter.get("/fetchcontactusorreport", ContactusContoller.fetchuserreportorcontactus)


export { contactusRouter };