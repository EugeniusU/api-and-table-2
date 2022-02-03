import { Injectable } from '@nestjs/common';
import { createQueryBuilder } from 'typeorm';

@Injectable()
export class AppService {
  async getAllLeadsWithContacts(): Promise<any[]> {
    const query = createQueryBuilder('leads_and_contacts', 'lc')
      .innerJoinAndSelect('lc.leadId', 'c')
      .innerJoinAndSelect('lc.contactId', 'd');

    const result = await query.getMany();
    return result;
  }
}
