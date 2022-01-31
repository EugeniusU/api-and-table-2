import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { Contacts } from 'src/entities/Contacts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, DatabaseModule, TypeOrmModule.forFeature([Contacts])],
  providers: [ContactsService],
  controllers: [ContactsController]
})
export class ContactsModule {}
