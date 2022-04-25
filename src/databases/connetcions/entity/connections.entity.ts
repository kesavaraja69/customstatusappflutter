import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "../../authentication/entity/users.entity";

@Entity("connection")
export class ConnectionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  connection_id!: number;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    nullable: false,
  })
  connection_time!: Date;
  //! connect to other user
  @Column({
    nullable: false,
  })
  to_connection_email!: string;
  //! my user or logged user
  @Column({
    nullable: false,
  })
  from_connection_email!: string;

  //! connected with many from users into single from user
  @ManyToOne(
    () => UserEntity,
    (from_userconnected_data) =>
      from_userconnected_data.from_userconnection_data
  )
  @JoinColumn()
  from_userconnected_data!: UserEntity;

  //! connected with many to logged users into single to user
  @ManyToOne(() => UserEntity,(to_userconnected_data)=>to_userconnected_data.to_userconnection_data)
  @JoinColumn()
  to_userconnected_data!: UserEntity;
}
