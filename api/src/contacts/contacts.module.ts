import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { Contacts } from 'src/entities/Contacts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { ApiModule } from 'src/api/api.module';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Contacts]), ApiModule],
  providers: [ContactsService],
  controllers: [ContactsController]
})
export class ContactsModule {}
