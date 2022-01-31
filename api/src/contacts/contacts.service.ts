import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom, map } from 'rxjs';
import { Contacts } from 'src/entities/Contacts';
import { Leads } from 'src/entities/Leads';
import { createQueryBuilder, getRepository, InsertResult, Repository, UpdateResult } from 'typeorm';

const fs = require('fs');

@Injectable()
export class ContactsService {
    constructor(@InjectRepository(Contacts) private readonly contactsRepository: Repository<Contacts>, private httpService: HttpService) {}

    readToken() {
        const file = fs.readFileSync('../tokens.json', 'utf8');
        const accessToken = JSON.parse(file)['access_token'];

        return accessToken;
    }

    headers() {
        let headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.readToken()}` }
        return headers;
    }

    baseUrl = 'https://new1641839342.amocrm.ru/api/v4/'

    async get(url) {
        return await lastValueFrom(this.httpService.get(url, {headers: this.headers()})
            .pipe(map(res => res.data)))     
    }

    async getAllContacts() {
        let res = await this.get(this.baseUrl + 'contacts?with=leads');
        let data = this.formatContacts(res['_embedded'].contacts);

        console.log(res['_embedded'].contacts[14])

        return data;
    }

    async findAllContacts(): Promise<Contacts[]> {
        return await this.contactsRepository.find();
    }

    formatContacts(contacts) {
        let formatted = contacts.map(contact => {
            let leadsId = contact['_embedded'].leads.map(lead => lead.id);
            let pre = contact['custom_fields_values'];

            if (pre && pre.length) {
                let obj = { phone: '', email: '' };
                pre.forEach((v, i) => {
                    if (v['field_code'] === 'PHONE') {
                        obj['phone'] = v.values[0].value;
                    } else if (v['field_code'] === 'EMAIL') {
                        obj['email'] = v.values[0].value;
                    }
                })

                pre = obj;

            } else {
                pre = { phone: '', email: '' }
            }


            return {
                externalId: contact.id,
                name: contact.name,
                responsibleuserid: contact['responsible_user_id'],
                leads: JSON.stringify(leadsId),
                phone: pre.phone,
                email: pre.email
            }
        })

        return formatted;
    }

    async updateContact(previousContact: Contacts, newContact: Contacts): Promise<UpdateResult> {
        return this.contactsRepository.update({externalId: previousContact.externalId}, newContact);
    }

    async createContact(contact: Contacts): Promise<InsertResult> {
        return this.contactsRepository.insert(contact);
    }

    async test() {
        const leads = await getRepository(Leads)
            .createQueryBuilder('leads')
            .innerJoin("leads", "contacts")
            .where("leads.externalId like '%contact.leads%'")
            .getMany()
            return leads;
    }

    
}