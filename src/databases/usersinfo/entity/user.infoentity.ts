import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../authentication/entity/users.entity";

@Entity("usersinfo")
export class UserInfoEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  info_id!: string;

  @Column({
    nullable: true,
  })
  aboutyourself!: string;

  @Column({
    nullable: true,
  })
  profileimage!: string;

  @OneToOne(()=> UserEntity,(user)=>user.info)
  @JoinColumn()
  user!:UserEntity;
}
