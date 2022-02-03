import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leads } from 'src/entities/Leads.entity';
import { ApiModule } from 'src/api/api.module';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Leads]), ApiModule],
  providers: [LeadsService],
  controllers: [LeadsController]
})
export class LeadsModule {}
