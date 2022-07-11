import Router from "express";
import { UserAmountWithdrawalController } from "../controllers/useramountwithdrawl.controller";


const amountRouter = Router();

//! post
amountRouter.post("/addamount", UserAmountWithdrawalController.adduseramount);
//! get
amountRouter.get(
  "/fetchuseramounts/:useremail",
  UserAmountWithdrawalController.fetchallrewardamountbyuser
);
export { amountRouter };
