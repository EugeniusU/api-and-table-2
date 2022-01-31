import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
//import { Contacts } from "./Contacts"
//import { Leads } from "./Leads"

@Entity()
export class LeadsAndContacts {
    @PrimaryGeneratedColumn()
    id: number

    @PrimaryColumn({unique: true})
    leadId: number

    @PrimaryColumn()
    contactId: number
}
