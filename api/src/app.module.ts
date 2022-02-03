import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeadsModule } from './leads/leads.module';
import { DatabaseModule } from './database/database.module';
import { ContactsModule } from './contacts/contacts.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiModule } from './api/api.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), LeadsModule, DatabaseModule, ContactsModule, ScheduleModule.forRoot(), ApiModule],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {}
