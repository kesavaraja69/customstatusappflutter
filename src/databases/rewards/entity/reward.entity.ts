import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "../../authentication/entity/users.entity";
import { PostEntity } from "../../posts/entity/post.entity";

@Entity("rewardpoint")
export class RewardEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  reward_id!: number;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    nullable: false,
  })
  reward_date!: Date;

  @Column({
    nullable: false,
  })
  reward_type!: string;

  @Column({
    nullable: false,
  })
  reward_points!: string;

  @Column({
    nullable: false,
  })
  reward_postname!: string;


  //! connection to user entity
  @ManyToOne(() => UserEntity, (reward_user) => reward_user.user_reward, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  reward_user!: UserEntity;

  // //! connection to post entity
  @ManyToOne(() => PostEntity, (reward_post) => reward_post.post_reward, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  reward_post!: PostEntity;
}
