import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "../../authentication/entity/users.entity";

@Entity("userrewardamount")
export class AmountEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  amount_id!: number;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    nullable: false,
  })
  amount_date!: Date;

  @Column({
    nullable: false,
  })
  reward_All_amount!: string;

  @Column({
    default: false,
    type: "boolean",
  })
  amount_recived!: boolean;

  @Column({
    default: false,
    type: "boolean",
  })
  payment_is_done!: boolean;

  @Column({
    default: false,
    type: "boolean",
  })
  payment_is_failed!: boolean;

  @Column({
    default: false,
    type: "boolean",
  })
  payment_is_pening!: boolean;

  //! connection to user entity
  @ManyToOne(() => UserEntity, (amount_user) => amount_user.user_amount, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  amount_user!: UserEntity;
}
