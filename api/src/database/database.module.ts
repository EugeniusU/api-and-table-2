import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Contacts } from 'src/entities/Contacts'
import { LeadsAndContacts } from 'src/entities/LeadsAndContacts'
import { Leads } from '../entities/Leads'

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "postgres",
    host: "127.0.0.1",
    port: 5432,
    username: "marcus",
    password: "marcus",
    database: "application",
    entities: [Leads, Contacts, LeadsAndContacts],
    synchronize: true
  })]
})

export class DatabaseModule {}
