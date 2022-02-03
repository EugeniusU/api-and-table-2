import { Controller, Get, Query } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Leads } from 'src/entities/Leads.entity';
import { LeadsService } from './leads.service';

@Controller('leads')
export class LeadsController {
    constructor(private readonly leadsService: LeadsService) {}

    @Get('all')
    async getAllLeads(): Promise<Leads[]> {
        return await this.leadsService.getAllLeads();
    }

    @Get('find')
    async findAllLeads(): Promise<Leads[]> {
        return await this.leadsService.findAllLeads();
    }

    @Get('with-contacts')
    async getLeadsWithContacts() {
        return await this.leadsService.getLeadsWithContacts()
    }

    @Get('with-contacts2')
    async getLeadsWithContacts2() {
        return await this.leadsService.formatForLeads()
    }

    @Get('update')
    async update(): Promise<string> {
        await this.leadsService.update();
        return 'updated'
    }

    @Get('search?')
    async search(@Query('query') query): Promise<Leads[] | []> {
        console.log(query);

        const result = await this.leadsService.search(query);
        return result;
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async updateFunc(): Promise<void> {
        await this.leadsService.update()
        console.log('update leads')
    }

    @Get('search2?')
    async searchWithJoin(@Query('query') query) {
        const result = await this.leadsService.searchWithJoin(query);
        return result;
    }
}
