import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Contacts {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    externalId: number

    @Column()
    name: string

    @Column()
    responsibleuserid: number

    @Column({nullable: true})
    phone: string

    @Column({nullable: true})
    email: string

//    @Column({nullable: true})
//    leads: string

//    @Column('jsonb', {nullable: true})
//    public leads: number[]

    @Column('jsonb', {nullable: true})
    leads: string

/*    @ManyToMany(() => Contacts, (contact: Contacts) => contact.leads)
    @JoinTable()
    public leads: Contacts[]*/
}