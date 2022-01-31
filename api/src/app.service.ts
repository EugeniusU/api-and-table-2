import { HttpService } from '@nestjs/axios';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { getRepository } from 'typeorm';
import { Contacts } from './entities/Contacts';
import { Leads } from './entities/Leads';
import { LeadsAndContacts } from './entities/LeadsAndContacts'
import * as fs from 'fs'

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {
///    let token = null
  }

///  token = null;
  public token = null;

  getHello(): string {
    return 'Hello World!';
  }

  async updateTable() {
    const leads = await getRepository(Leads).find();
    const contacts = await getRepository(Contacts).find();

    const contactAndLeadsConn = await getRepository(LeadsAndContacts);
    const contactAndLeads = await contactAndLeadsConn.find();

    const contactAndLeadsObj = contactAndLeads.map(link => {
      link.contactsId = JSON.parse(link.contactsId);
      link.leadsId = JSON.parse(link.leadsId);
      return link;
    })

    const forUpdateLinks = [];

    leads.forEach((lead: Leads) => {
      contacts.forEach((contact: Contacts) => {
        if (contact.leads) {
        let contactLeads = JSON.parse(contact.leads);
//        console.log(contactLeads)
        if (contact.leads && contactLeads.includes(lead.externalId)) {
          let link = {contactId: contact.externalId, leadsId: contactLeads};
//          contactAndLeads.update({}: LeadsAndContacts, link: LeadsAndContacts);
          forUpdateLinks.push(link);
          console.log(link)
///          contactAndLeads.update(, link);
        }
       }
      })
    })

    if (!contactAndLeads.length) {

      forUpdateLinks.forEach(upLink => {
        let link = { leadsId: JSON.stringify(upLink.leadsId), contactsId: JSON.stringify(upLink.contactId) };
        contactAndLeadsConn.insert(link);
      })

      return forUpdateLinks;

    } else {
///      console.log(forUpdateLinks.length)
///      console.log(contactAndLeadsObj.length)

      let ids = contactAndLeadsObj.map(lead => lead.contactsId);
      let newContact = forUpdateLinks.filter(lead => {
        if (!ids.includes(lead.contactId)) {
          return lead;
        }
      })

///      console.log(newContact)

      newContact.forEach(upLink => {
        let link = { leadsId: JSON.stringify(upLink.leadsId), contactsId: JSON.stringify(upLink.contactId) };
        contactAndLeadsConn.insert(link);
      })

///      ids
    }
  }

  async allWithLeads() {
    const contactAndLeads = await getRepository(LeadsAndContacts).find();
    const leadsConn = await getRepository(Leads);
    const contactsConn = await getRepository(Contacts);

    let all = [];

    for (const link of contactAndLeads) {
      let linkObj = { contactId: JSON.parse(link.contactsId), leadsId: JSON.parse(link.leadsId) }
      let contact = await contactsConn.findOne({ externalId: linkObj.contactId });

      for (const lead of linkObj.leadsId) {
        let leadFind = await leadsConn.findOne({ externalId: lead });
        leadFind['contact'] = contact;
        all.push(leadFind);

        ///          console.log(contact);
      }
    }

    return all;
  }

  async query(str) {
    const contactAndLeads = await getRepository(LeadsAndContacts).find();
    const leadsConn = await getRepository(Leads);
    const contactsConn = await getRepository(Contacts);

    let all = [];

    for (const link of contactAndLeads) {
      let linkObj = { contactId: JSON.parse(link.contactsId), leadsId: JSON.parse(link.leadsId) }
      let contact = await contactsConn.findOne({ externalId: linkObj.contactId });

      for (const lead of linkObj.leadsId) {
        let leadFind = await leadsConn.findOne({ externalId: lead });
        leadFind['contact'] = contact;
        all.push(leadFind);

        console.log(contact);
      }
    }

    let q = this.search(str, all);
    return q;
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
      
///      const tokens = fs.readFileSync('./tokens.json', 'utf8');
//console.log(__dirname)
//      console.log(await fs.promises.readdir('../'))
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
        this.token = responseData['access_token'];
        return responseData;
  }

  async initUpdate() {
    this.auth2();
  }

  @Timeout(1000)
  async init() {
///    console.log('init', 2)
    this.auth2()
  }
}
