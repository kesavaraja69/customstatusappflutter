import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import * as EmailValidator from "email-validator";
import bycrypt from "bcrypt";
import {
  createQueryBuilder,
  getCustomRepository,
  getRepository,
} from "typeorm";
import { UserRepository } from "../databases/authentication/repository/users.repositroy";
dotenv.config();
export class AuthenticationControllers {
  static createJWt = async (payload: any, res: Response) => {
    let jwt_secret = process.env.JWT_SCRECT as string;
    jwt.sign(
      { payload },
      jwt_secret,
      {
        expiresIn: "1hr",
      },
      async (error: any, jwtData: any) => {
        if (error) {
          return res.send({
            user: null,
            message: "something went wrong",
            authenticated: false,
            code: 402,
          });
        }
        return res.send({
          user: payload,
          message: jwtData,
          authenticated: true,
          code: 201,
        });
      }
    );
  };

  static async createNewAccount(req: Request, res: Response) {
    let { useremail, userpassword } = req.body;

    let isValidated = EmailValidator.validate(useremail);

    if (!isValidated) {
      return res.send({
        user: null,
        authentication: false,
        message: "invalid email",
        code: 302,
      });
    }

    let salt = await bycrypt.genSalt(10);

    bycrypt.hash(
      userpassword,
      salt,
      async (error: any, hashedpassword: any) => {
        if (error) {
          return res.send({
            user: null,
            message: "something went wrong",
            authenticated: false,
            code: 403,
          });
        }
        console.log(hashedpassword);

        let userRepository = getCustomRepository(UserRepository);
        await userRepository.submitUserData(req, res, hashedpassword);
        await AuthenticationControllers.createJWt(useremail, res);
      }
    );
  }

  static async createAdminAccount(req: Request, res: Response) {
    let { useremail, userpassword } = req.body;

    let isValidated = EmailValidator.validate(useremail);

    if (!isValidated) {
      return res.send({
        user: null,
        authentication: false,
        message: "invalid email",
        code: 302,
      });
    }

    let salt = await bycrypt.genSalt(10);

    bycrypt.hash(
      userpassword,
      salt,
      async (error: any, hashedpassword: any) => {
        if (error) {
          return res.send({
            user: null,
            message: "something went wrong",
            authenticated: false,
            code: 403,
          });
        }
        console.log(hashedpassword);

        let userRepository = getCustomRepository(UserRepository);
        await userRepository.submitAdminData(req, res, hashedpassword);
        await AuthenticationControllers.createJWt(useremail, res);
      }
    );
  }

  static async fetchComment(req: Request, res: Response) {
    let userRepository = getCustomRepository(UserRepository);
    await userRepository.fetchComment(req, res);
  }

  static async updateamountpoint(req: Request, res: Response) {
    let userRepository = getCustomRepository(UserRepository);
    await userRepository.updateamountpoint(req, res);
  }

  static async fetchfullscreenuserBookmark(req: Request, res: Response) {
    let userRepository = getCustomRepository(UserRepository);
    await userRepository.fetchfullscreenuserBookmark(req, res);
  }

  static async fetchUserProfileData(req: Request, res: Response) {
    let userRepository = getCustomRepository(UserRepository);
    await userRepository.fetchUserProfileData(req, res);
  }

  static async updatewithlowamountpoint(req: Request, res: Response) {
    let userRepository = getCustomRepository(UserRepository);
    await userRepository.updatewithlowamountpoint(req, res);
  }

  static async updatetodaypaymentid(req: Request, res: Response) {
    let userRepository = getCustomRepository(UserRepository);
    await userRepository.updatetodaypaymentid(req, res);
  }

  static async updatetodaypoint(req: Request, res: Response) {
    let userRepository = getCustomRepository(UserRepository);
    await userRepository.updatetodaypoint(req, res);
  }

  static async fetchtodayrewardpointbyuser(req: Request, res: Response) {
    let userRepository = getCustomRepository(UserRepository);
    await userRepository.fetchtodayrewardpointbyuser(req, res);
  }

  static async fetchallrewardpointbyuser(req: Request, res: Response) {
    let userRepository = getCustomRepository(UserRepository);
    await userRepository.fetchallrewardpointbyuser(req, res);
  }

  static async fetchpostComment(req: Request, res: Response) {
    let userRepository = getCustomRepository(UserRepository);
    await userRepository.fetchpostComment(req, res);
  }

  static async updateprofilename(req: Request, res: Response) {
    let userRepository = getCustomRepository(UserRepository);
    await userRepository.updateprofilename(req, res);
  }

  static async checkUserData(req: Request, res: Response) {
    let userRepository = getCustomRepository(UserRepository);
    await userRepository.checkUserData(req, res);
  }
  static async fetchUserData(req: Request, res: Response) {
    let userRepository = getCustomRepository(UserRepository);
    await userRepository.fetchUserData(req, res);
  }
  static async fetchUserInfoData(req: Request, res: Response) {
    let userRepository = getCustomRepository(UserRepository);
    await userRepository.fetchUserInfoData(req, res);
  }

  static async fetchuserMyConnection(req: Request, res: Response) {
    let userRepository = getCustomRepository(UserRepository);
    await userRepository.fetchuserMyConnection(req, res);
  }

  static async login(req: Request, res: Response) {
    let { useremail, userpassword } = req.body;

    try {
      let isValidated = EmailValidator.validate(useremail);

      if (!isValidated) {
        return res.send({
          user: null,
          authentication: false,
          message: "invalid email",
          code: 402,
        });
      }

      let userRepository = getCustomRepository(UserRepository);
      let checkuser = await getCustomRepository(UserRepository)
        .createQueryBuilder("users")
        .select()
        .where("users.useremail = :useremail", { useremail })
        .getOne();

      if (checkuser === undefined) {
        return res.send({
          user: null,
          message: "user not found",
          authenticated: false,
          code: 407,
        });
      } else {
        let oldPassword = (await userRepository.findUserPassword(
          useremail,
          res
        )) as string;
        bycrypt.compare(
          userpassword,
          oldPassword,
          async (error: any, isMatched: boolean) => {
            if (error) {
              return res.send({
                message: "something went wrong",
                authenticated: false,
                code: 403,
              });
            }
            if (!isMatched) {
              return res.send({
                message: "wrong password",
                authenticated: false,
                code: 409,
              });
            } else {
              await AuthenticationControllers.createJWt(useremail, res);
            }
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async loginadmin(req: Request, res: Response) {
    let admin_token = req.headers.authorization;
    let base_admin_sceret_kry = process.env.ADMIN_SCRECT_PASSWORD;

    let { useremail, userpassword } = req.body;

    let isValidated = EmailValidator.validate(useremail);

    if (!isValidated) {
      return res.send({
        user: null,
        authentication: false,
        message: "invalid email",
        code: 402,
      });
    }
    if (admin_token === base_admin_sceret_kry) {
      let userRepository = getCustomRepository(UserRepository);
      let oldPassword = (await userRepository.findUserPassword(
        useremail,
        res
      )) as string;

      bycrypt.compare(
        userpassword,
        oldPassword,
        async (error: any, isMatched: boolean) => {
          if (error) {
            return res.send({
              message: "something went wrong",
              authenticated: false,
              code: 403,
            });
          }
          if (!isMatched) {
            return res.send({
              message: "wrong password",
              authenticated: false,
              code: 409,
            });
          } else {
            await AuthenticationControllers.createJWt(useremail, res);
          }
        }
      );
    } else {
      return res.send({
        message: "your not admin",
        authenticated: false,
        code: 503,
      });
    }
  }

  static verifyjwtdata(req: Request, res: Response) {
    let token = req.headers.authorization as string;
    let jwt_secret = process.env.JWT_SCRECT as string;

    jwt.verify(token, jwt_secret, async (error: any, data: any) => {
      if (error) {
        return res.send({
          authentication: false,
          message: "something went wrong",
        });
      }
      let useremail = data!.useremail;
      return res.send({
        authentication: true,
        message: useremail,
      });
    });
  }
}
