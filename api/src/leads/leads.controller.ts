import { Controller, Get, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LeadsService } from './leads.service';

@Controller('leads')
export class LeadsController {
    constructor(private readonly leadsService: LeadsService) {}

    @Get('all')
    findAllLeads() {
        return this.leadsService.getAllLeads();
    }

    @Get('find')
    getAllLeads() {
        return this.leadsService.findAllLeads();
    }

    @Get('statuses')

    getStatuses() {
        return this.leadsService.statusesID();
    }

    @Get('pipelines')
    getPipelines() {
        return this.leadsService.pipelineID();
    }

    @Get('ids')
    getIds() {
        return this.leadsService.leadsID();
    }

    @Get('update')
    async getAllWithStatuses() {
        let leads =  await this.leadsService.formatLeads();
        let previous = await this.leadsService.findAllLeads();

        leads.forEach(lead => {
            previous.forEach((pre, i) => {
                if (pre.externalId === lead.externalId) {
                    let keys = Object.keys(lead);
                    
                    for (let i = 0; i < keys.length; i++) {
                        let key = keys[i];
                        let valuePre = pre[key];
                        let valueNow = lead[key];

                        if (valueNow !== valuePre) {
                            this.leadsService.updateLead(pre, lead);
                            break;
                        }
                    }
                }
            })
        })

        let previousIds = previous.map(lead => lead.externalId);

        let uniqs = leads.filter(lead => {
            if (!previousIds.includes(lead.externalId)) {
                return lead;
            }
        })

        uniqs.forEach(lead => {
            this.leadsService.createLead(lead)
        })
    }

    @Get('search/:query')
    search(@Param('query') query) {
        return this.leadsService.search(query.toLowerCase());
    }

    @Get('auth2')
    auth2() {
        return this.leadsService.auth2()
    }
}
