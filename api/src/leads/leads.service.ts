import { Injectable } from '@nestjs/common';
import { Leads } from 'src/entities/Leads.entity';
import { createQueryBuilder, getRepository, InsertResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiService } from 'src/api/api.service';
import { Contacts } from 'src/entities/Contacts.entity';
import { LeadsAndContacts } from 'src/entities/LeadsAndContacts.entity';

@Injectable()
export class LeadsService {
    constructor(@InjectRepository(Leads) private readonly leadsRepository: Repository<Leads>, private apiService: ApiService) { }

    baseUrl = 'https://new1641839342.amocrm.ru/api/v4/'

    leads = `${this.baseUrl}leads`;
    contacts = `${this.baseUrl}contacts`;
    users = `${this.baseUrl}users`;
    pipelines = `${this.baseUrl}leads/pipelines`;
    leadsWithContacts = `${this.baseUrl}leads?with=contacts`;

    async get(url: string): Promise<any> {
        return await this.apiService.get(url);
    }

    async getAllLeads(): Promise<any[]> {
        return await this.get(this.baseUrl + 'leads?with=contacts');
    }

    async pipelineID(): Promise<any[]> {
        let res = await this.get(this.baseUrl + 'leads/pipelines');
        let ids = res['_embedded'].pipelines;

        return ids;
    }

    async createLead(lead: Leads): Promise<InsertResult> {
        return this.leadsRepository.insert(lead);
    }

    async updateLead(previousLead: Leads, newLead: Leads): Promise<UpdateResult> {
        return this.leadsRepository.update({ externalId: previousLead.externalId }, newLead);
    }

    async save(lead: Leads): Promise<Leads> {
        return this.leadsRepository.save(lead)
    }

    async findAllLeads(): Promise<Leads[]> {
        return await this.leadsRepository.find();
    }

    async getLeadsWithContacts(): Promise<any[]> {
        return await this.get(this.baseUrl + 'leads?with=contacts')
    }

    async leadsWithStatuses(): Promise<any[]> {
        let pipelines = await this.pipelineID();
        let ids: number[] = pipelines.map(pipeline => pipeline.id);

        let leadsAll = await this.getLeadsWithContacts();
        let leads: any[] = leadsAll['_embedded'].leads;

        let paths = ids.map(id => `${this.baseUrl}leads/pipelines/${id}`);

        let statusesAll = await Promise.all(paths.map(path => this.get(`${path}}`)));

        let statuses = statusesAll.map(pipeline => pipeline['_embedded'].statuses);

        let pipelinesWithLeads = [];

        pipelines.forEach(pipeline => {
            let obj = { name: pipeline.name, id: pipeline.id, leads: [] };
            pipelinesWithLeads.push(obj);
        })

        leads.forEach(lead => {
            statuses.forEach((pipeline, index) => {
                pipeline.forEach(status => {

                    if (lead['status_id'] === status.id && lead['pipeline_id'] === status['pipeline_id']) {
                        lead['statusName'] = status.name;
                        lead['statusColor'] = status.color;
                    }
                })
            })
        })

        leads.forEach(lead => {
            pipelines.forEach(pipeline => {
                if (lead['pipeline_id'] === pipeline['id']) {
                    lead['pipelineName'] = pipeline.name;
                }
            })
        })

        return leads;
    }

    async formatForLeads(): Promise<Leads[]> {
        let res = await this.leadsWithStatuses();
        let formatted: Leads[] = res.map(lead => {
            let contacts = lead['_embedded']['contacts'];
            let contactId = contacts.map(contact => {
                return { id: contact.id, 'is_main': contact['is_main'] }
            })

            if (contactId.some(contact => Object.values(contact).includes(true))) {
                contactId = contactId.filter(contact => contact['is_main'] === true)
            }

///            console.log(contactId)

            return {
                externalId: lead.id,
                name: lead.name,
                budget: lead.price,
                responsibleuserid: lead['responsible_user_id'],
                status: {statusId: lead['status_id'], statusName: lead.statusName, statusColor: lead.statusColor},
                pipeline: {pipelineName: lead.pipelineName},
                createdAt: lead['created_at'],
                contactId: contactId.length ? contactId[0].id : null
            }
        })

        return formatted;
    }

    async update(): Promise<void> {
        let leads = await this.formatForLeads();
        leads.forEach(async (element: Leads) => {
            let lead = await this.leadsRepository.findOne({externalId: element.externalId});
            if (lead) {
                this.updateLead(element, element)
            } else {
                this.createLead(element);
            }

            let contact = await getRepository(Contacts).findOne({externalId: element.contactId});
            let leadAndContactConn = await getRepository(LeadsAndContacts);

            if (lead && contact) {
                let linkFind = await leadAndContactConn.findOne({leadId: lead.id, contactId: contact.id})

                if (!linkFind) {
                    await leadAndContactConn.save({leadId: lead.id, contactId: contact.id})
                }
            }
            
        });
    }

    async search(str: string): Promise<Leads[] | []> {
        const query = createQueryBuilder(Leads, 'leads');

        const result = await query.where(`concat(leads.name, leads.status, leads.pipeline) ilike '%${str}%'`)
            .getMany()

        return result;
    }

    async searchWithJoin(str: string) {
        const query = createQueryBuilder('leads_and_contacts', 'lc')
            .where(`concat(leads.name, leads.status, leads.pipeline) ilike '%${str}%'`)
            .innerJoinAndSelect('lc.leadId', 'leads')
            .innerJoinAndSelect('lc.contactId', 'contacts')
            

        const result = await query.getMany();
        return result;
    }

}   
