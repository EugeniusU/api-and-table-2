import { HttpService } from '@nestjs/axios';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { getRepository, QueryBuilder } from 'typeorm';
import { Contacts } from './entities/Contacts';
import { Leads } from './entities/Leads';
import { LeadsAndContacts } from './entities/LeadsAndContacts'
import * as fs from 'fs'

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) { }

  getHello(): string {
    return 'Hello World!';
  }

  async search(str, all) {
    let result = [];

    all.forEach(lead => {
      let values = Object.values(lead);

      for (let i = 0; i < values.length; i++) {
        let v = values[i];
        console.log(v);
        if (v.toString().toLowerCase().includes(str)) {
          result.push(lead);
          break;
        }
      }
    })

    return result;
  }

  @Cron('* * * 1 *')
  handleCron() {
    ///      this.updateTable()    // update db
    this.updateToken()    // update token
  }

  async updateToken(): Promise<void> {

  }

  async auth2() {
    const requestConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const tokens = fs.readFileSync('../tokens.json', 'utf8');
    const refreshToken = JSON.parse(tokens)['refresh_token'];

    const data = {
      'client_id': 'd52f7009-6310-4b6a-9215-e3fe5c00fe45',
      'client_secret': 'RkvLVHCKWtqsOqQSMq7bhMaQcCvONUERNT54CQ1hhkfOrHIml5hcsiFJMie0t8oy',
      'grant_type': 'refresh_token',
      'refresh_token': refreshToken,
      'redirect_uri': 'https://example.org'
    };

    const responseData = await lastValueFrom(
      this.httpService.post('https://new1641839342.amocrm.ru/oauth2/access_token/', data, requestConfig).pipe(
        map((response) => {
          return response.data;
        }),
      ),
    );

    ///      return responseData;
    console.log(responseData);
    fs.writeFileSync('../tokens.json', JSON.stringify(responseData));

    console.log('updated');
    //        this.token = responseData['access_token'];
    return responseData;
  }

  async initUpdate() {
    this.auth2();
  }

  @Timeout(1000)
  async init() {
    ///    console.log('init', 2)
    this.auth2()
    ///    this.updateTable()
  }

  async updateTable() {
    const leads = await getRepository(Leads).find();
    const contacts = await getRepository(Contacts).find();
    const LeadsAndContactsConn = await getRepository(LeadsAndContacts);

    leads.forEach((lead: Leads) => {
      let link: LeadsAndContacts = { id: null, leadId: lead.externalId, contactId: lead.contactId }
      if (lead.contactId) {
        LeadsAndContactsConn.save(link)
      } else {
        console.log('empty contact id')
      }
    })
  }


  async getAll() {
    const leads = await getRepository(LeadsAndContacts).find();
    const leadsWithContact = [];

    for (const lead of leads) {
      let contact = await getRepository(Contacts).findOne({ externalId: lead.contactId })
      let leadOrigin = await getRepository(Leads).findOne({ externalId: lead.leadId });

      leadOrigin['contact'] = contact;
      leadsWithContact.push(leadOrigin);
    }

    return leadsWithContact;
  }

  async search2(str: string) {
    let all = await this.getAll();

    let filtred = all.filter(lead => {
      let values = Object.values(lead)
      let contactValues = Object.values(lead.contact)

      values = values.map((v: string | number) => v.toString().toLowerCase());
      contactValues = contactValues.map((v: string | number) => v.toString().toLowerCase());

      ///      console.log(contactValues)

      if (values.some((v: string) => v.includes(str)) || contactValues.some((v: string) => v.includes(str))) {
        return lead;
      }
    })

    return filtred;
  }
}
