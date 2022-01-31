import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
import { Contacts } from "./Contacts"
import { Leads } from "./Leads"

@Entity()
export class LeadsAndContacts {
    @PrimaryGeneratedColumn()
    id: number

//    @ManyToMany(() => Leads, (lead: Leads) => lead.externalId)
//    public leadId: Leads[]

/*    @ManyToMany(() => Contacts, (contact: Contacts) => contact.leads)
    @JoinTable()
    public leads: Contacts[]*/

    @Column('jsonb')
///    public leadsId: number[]
    leadsId: string

    @Column('jsonb')
///    public contactsId: number[]
    contactsId: string
}