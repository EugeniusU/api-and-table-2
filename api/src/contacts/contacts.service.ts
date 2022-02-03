import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiService } from 'src/api/api.service';
import { Contacts } from 'src/entities/Contacts.entity';
import { InsertResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ContactsService {
    constructor(@InjectRepository(Contacts) private readonly contactsRepository: Repository<Contacts>, private apiService: ApiService) {}

    baseUrl = 'https://new1641839342.amocrm.ru/api/v4/'

    async getAllContacts() {
        let res = await this.apiService.get(this.baseUrl + 'contacts');
        let data = this.formatContacts(res['_embedded'].contacts);

        return data;
    }

    async findAllContacts(): Promise<Contacts[]> {
        return await this.contactsRepository.find();
    }

    formatContacts(contacts) {
        let formatted = contacts.map(contact => {
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
                responsibleUserId: contact['responsible_user_id'],
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

    async save(contact: Contacts) {
        return this.contactsRepository.save(contact)
    }

    async update() {
        let contacts = await this.getAllContacts();
        contacts.forEach(async element => {
            if (await this.contactsRepository.findOne({externalId: element.externalId})) {
                this.updateContact(element, element);
            } else {
                this.createContact(element)
            }
        });
    }
}