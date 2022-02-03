import { Controller, Get } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
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
    async update() {
        let res = await this.contactsService.update()
        return 'updated';
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async updateFunc(): Promise<void> {
        await this.contactsService.update()
        console.log('update contacts')
    }
}
