import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
import { Contacts } from "./Contacts"

@Entity()
export class Leads {
/*  @PrimaryGeneratedColumn()
  count: number

  @Column()
  id: number

  @Column()
  externalId: number

  @Column()
  name: string

  @Column()
  budget: number

  @Column()
//  status: JSON
  status: string
//    status: json
*/

@PrimaryGeneratedColumn()
id: number

@Column({unique: true})
public externalId: number

///@Index({fulltext: true})
@Column()
name: string

@Column()
budget: number

@Column()
//  status: JSON
statusname: string

@Column()
statuscolor: string

@Column()
pipelinename: string

@Column()
statusid: number

@Column()
responsibleuserid: number

@Column({nullable: true})
createdAt: number
  
@Column({nullable: true})
contactId: number
}

