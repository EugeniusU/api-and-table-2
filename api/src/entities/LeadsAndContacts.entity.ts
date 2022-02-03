import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Contacts } from "./Contacts.entity"
import { Leads } from "./Leads.entity"

@Entity()
export class LeadsAndContacts {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => Leads, lead => lead.id)
    @JoinColumn([{name: 'leadId'}, {name: 'id'}])
    leadId: number

    @ManyToOne(type => Contacts, contact => contact.id)
    @JoinColumn([{name: 'contactId'}, {name: 'id'}])
    contactId: number
}
