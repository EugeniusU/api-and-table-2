import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { LeadsAndContacts } from "./LeadsAndContacts.entity"

@Entity()
export class Contacts {
    @PrimaryGeneratedColumn()
    id: number

    @Column('int', { unique: true })
    externalId: number

    @Column()
    name: string

    @Column({nullable: true})
    responsibleUserId: number

    @Column({nullable: true})
    phone: string

    @Column({nullable: true})
    email: string

    @OneToMany(type => LeadsAndContacts, leadsAndContacts => leadsAndContacts.contactId)
    contactsId: LeadsAndContacts[]
}

