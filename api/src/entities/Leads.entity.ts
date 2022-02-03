import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { LeadsAndContacts } from "./LeadsAndContacts.entity"

interface Status {
  statusName: string
  statusId: number
  statusColor: string
}

interface Pipeline {
  pipelineName: string
}

@Entity()
export class Leads {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({ unique: true })
  externalId: number

  @Column()
  name: string

  @Column()
  budget: number

  @Column('jsonb', {nullable: true})
  status: Status

  @Column('jsonb', {nullable: true})
  pipeline: Pipeline

  @Column()
  responsibleuserid: number

  @Column({ nullable: true })
  createdAt: number

  @Column('int', { nullable: true })
  contactId: number

  @OneToMany(type => LeadsAndContacts, leadsAndContacts => leadsAndContacts.leadId)
  leadsId?: LeadsAndContacts[]
}

