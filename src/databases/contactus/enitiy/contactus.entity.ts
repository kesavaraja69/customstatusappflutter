import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../authentication/entity/users.entity";

@Entity("contactus")
export class ContactusEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    contactus_id!: number;

    @Column({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        nullable: false,
    })
    contactus_date!: Date;

    @Column({
        nullable: false,
    })
    contactus_name!: string;

    @Column({
        nullable: false,
    })
    iscontactus!: string;

    @Column({
        nullable: false,
    })
    contactus_email!: string;

    @Column({
        nullable: false,
    })
    contactus_message!: string;

    @ManyToOne(() => UserEntity, (log_user) => log_user.contactus)
    log_user!: UserEntity;


}