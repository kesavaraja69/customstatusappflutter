import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { Request, Response } from "express";
import { ConnectionEntity } from "../entity/connections.entity";
import { UserRepository } from "../../authentication/repository/users.repositroy";

@EntityRepository(ConnectionEntity)
export class ConnectionRepository extends Repository<ConnectionEntity> {
  async addConnection(req: Request, res: Response) {
    let { to_connection_email, from_connection_email } = req.body;

    let isAlreadyConnectedbyOneside =
      (await this.createQueryBuilder("connection")
        .select()
        .where("connection.to_connection_email = :to_connection_email", {
          to_connection_email,
        })
        .andWhere("connection.from_connection_email = :from_connection_email", {
          from_connection_email,
        })
        .getCount()) > 0;

    if (isAlreadyConnectedbyOneside) {
      res.send({
        code: 302,
        data: "user is connected already",
      });
    }

    if (!isAlreadyConnectedbyOneside) {
      let userRepository = getCustomRepository(UserRepository);

      let to_connected_user_data = await userRepository.findOne({
        useremail: to_connection_email,
      });

      let from_connected_user_data = await userRepository.findOne({
        useremail: from_connection_email,
      });

      let connectionEntity = new ConnectionEntity();

      connectionEntity.from_userconnected_data = from_connected_user_data!;
      connectionEntity.to_userconnected_data = to_connected_user_data!;
      connectionEntity.from_connection_email = from_connection_email;
      connectionEntity.to_connection_email = to_connection_email;

      await connectionEntity
        .save()
        .then((data: any) => {
          if (data !== undefined) {
            return res.send({
              code: 201,
              data: "Connection established",
            });
          }
        })
        .catch((error: any) => {
          if (error !== undefined) {
            console.log(error);
            return res.send({
              code: 406,
              data: "Something went wrong, Try again",
            });
          }
        });
    }
  }

  async fetchMyConnectiondata(req: Request, res: Response) {
    let { user_email } = req.params;

    try {
      let response = await this.createQueryBuilder("connection")
        .leftJoinAndSelect("connection.to_userconnected_data", "users")
        .select([
          "connection",
          "users.useremail",
          "users.username",
          "users.id",
        ])
        .where("connection.from_connection_email = :user_email", { user_email })
        .getMany();
      if (response !== undefined) {
        res.send({
          code: 201,
          data: response,
          message: "fetched my connection"
        });
      }
      if (response === undefined) {
        res.send({
          code: 304,
          data: null,
          message: "not fetch my connection"

        });
      }
    } catch (error) {
      if (error) {
        res.send({
          code: 401,
          data: null,
          message: "something went wrong",
        });
      }
    }
  }

  async removeConnection(req: Request, res: Response) {
    let { from_connection_email, to_connection_email } = req.body;

    let getconnectionId = await this.createQueryBuilder("connection")
      .select("connection.connection_id")
      .where("connection.to_connection_email = :to_connection_email", {
        to_connection_email,
      })
      .andWhere("connection.from_connection_email = :from_connection_email", {
        from_connection_email,
      })
      .getOne();

    let connection_id = getconnectionId?.connection_id;
    if (connection_id !== undefined) {
      await this.createQueryBuilder("connection")
        .delete()
        .from(ConnectionEntity)
        .where("connection.connection_id = :connection_id", { connection_id })
        .execute()
        .then((data: any) => {
          let isAffected = data.affected;
          if (isAffected) {
            res.send({
              code: 204,
              data: "connection removed",
              removed: true,
            });
          } else {
            res.send({
              code: 303,
              data: "connection not removed",
              removed: false,
            });
          }
        })
        .catch((error: any) => {
          res.send({
            code: 302,
            data: "something went wrong",
            removed: false,
          });
        });
    }
    if (connection_id === undefined) {
      return res.send({
        code: 403,
        data: "Connection not found",
        removed: false,
      });
    }
  }
  async checkIfConnected(req: Request, res: Response) {
    let { from_connection_email, to_connection_email } = req.params;

    try {
      let isConnectionAvailabe =
        (await this.createQueryBuilder("connection")
          .where("connection.to_connection_email = :to_connection_email", {
            to_connection_email,
          })
          .andWhere(
            "connection.from_connection_email = :from_connection_email",
            { from_connection_email }
          )
          .getCount()) > 0;

      if (isConnectionAvailabe) {
        return res.send({
          code: 201,
          isconnected: true
        });
      }
      if (!isConnectionAvailabe) {
        return res.send({
          code: 304,
          isconnected: false,
        });
      }
    } catch (error) {
      return res.send({
        code: 302,
        isconnected: false,
      });
    }
  }

  async renderfollowers(req: Request, res: Response) {
    let { to_useremail } = req.params;

    try {
      let response = await this.createQueryBuilder("connection")
        .leftJoinAndSelect("connection.from_userconnected_data", "users")
        .select([
          "connection",
          "users.useremail",
          "users.username",
          "users.id",
        ])
        .where("connection.to_connection_email = :to_useremail", {
          to_useremail,
        })
        .getMany();

      if (response !== undefined) {
        return res.send({
          code: 201,
          data: response,
          message: "render followers sucessfully",
        });
      }

      if (response === undefined) {
        return res.send({
          code: 300,
          data: null,
          message: "no followers",
        });
      }
    } catch (error) {
      return res.send({
        code: 304,
        data: null,
        message: "something went wrong",
      });
    }
  }
}
