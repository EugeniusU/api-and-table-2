import { Controller, Get } from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
    constructor(private readonly contactsService: ContactsService) {}

    @Get('all')
    async getAllContacts() {
        return this.contactsService.getAllContacts();
    }

    @Get('find')
    findAllContacts() {
        return this.contactsService.findAllContacts();
    }

    @Get('update')
    async updateContacts() {
        let previous = await this.findAllContacts();
        let contacts = await this.getAllContacts();

        console.log(previous)

        if (previous.length) {
            previous.forEach(pre => {
                contacts.forEach(contact => {
                    if (pre.externalId === contact.externalId) {
                        let keys = Object.keys(contact);

                        for (let i = 0; i < keys.length; i++) {
                            let key = keys[i];
                            let valuePre = pre[key];
                            let valueNow = contact[key];

                            if (valueNow !== valuePre) {
                                this.contactsService.updateContact(pre, contact);
                                break;
                            }
                        }
                    }
                })
            })

        }

        let previousIds = previous.map(contact => contact.externalId);

        let uniqs = contacts.filter(contact => {
            if (!previousIds.includes(contact.externalId)) {
                return contact;
            }
        })

        console.log(uniqs)

        uniqs.forEach(lead => {
            this.contactsService.createContact(lead)
        })
    }

    @Get('test')
    test() {
        return this.contactsService.test();
    }
}
