import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeadsModule } from './leads/leads.module';
import { DatabaseModule } from './database/database.module';
import { ContactsModule } from './contacts/contacts.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import * as fs from 'fs';

@Module({
  imports: [LeadsModule, DatabaseModule, ContactsModule, ScheduleModule.forRoot(), HttpModule],
  controllers: [AppController],
  providers: [AppService],
///  exports: [{'refresh_token': fs.readFileSync('../token.json', 'utf8')}]
})
export class AppModule {}
