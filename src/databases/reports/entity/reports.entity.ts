import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../authentication/entity/users.entity";



@Entity("reports")
export class ReportsEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    report_id!: number;

    @Column({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        nullable: false,
    })
    report_date!: Date;

    @Column({
        nullable: false,
    })
    report_name!: string;

    @Column({
        nullable: false,
    })
    report_email!: string;

    @Column({
        nullable: false,
    })
    report_message!: string;
    
    @ManyToOne(()=>UserEntity,(log_user)=>log_user.reports)
    log_user!:UserEntity;  
}