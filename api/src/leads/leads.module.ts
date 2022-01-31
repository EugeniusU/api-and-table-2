import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leads } from 'src/entities/Leads';

@Module({
  imports: [HttpModule, DatabaseModule, TypeOrmModule.forFeature([Leads])],
  providers: [LeadsService],
  controllers: [LeadsController]
})
export class LeadsModule {}
