import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { lastValueFrom, Observable } from 'rxjs';
import { Leads } from 'src/entities/Leads';
import { finalize, map } from 'rxjs/operators'
import { InsertResult, MetadataAlreadyExistsError, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { appendFile } from 'fs';
import { AppService } from 'src/app.service';

const fs = require('fs');
//const file = fs.readFileSync('../tokens2.json', 'utf8');
//const accessToken = JSON.parse(file)['access_token'];

@Injectable()
export class LeadsService {
    constructor(@InjectRepository(Leads) private readonly leadsRepository: Repository<Leads>, private httpService: HttpService) {}

    readToken() {
 ///       const file = fs.readFileSync('../../../tokens.json', 'utf8');
 ///       const file = fs.readFileSync('../../tokens.json', 'utf8');
 ///       console.log(await fs.promises.readdir('../tokens.json', 'utf8'))
        const file = fs.readFileSync('../tokens.json', 'utf8');
///        console.log('../');
 ///       console.log(__dirname)
        const accessToken = JSON.parse(file)['access_token'];

        return accessToken;
    }

    headers() {
///        return this.readToken();
        let headers = {'Content-Type': 'application/json','Authorization': `Bearer ${this.readToken()}`}
        return headers;
    }

///    headers = {'Content-Type': 'application/json','Authorization': `Bearer ${accessToken}`}
///    headers = {'Content-Type': 'application/json','Authorization': `Bearer ${this.readToken()}`}
    baseUrl = 'https://new1641839342.amocrm.ru/api/v4/'

    leads = `${this.baseUrl}leads`;
    contacts = `${this.baseUrl}contacts`;
    users = `${this.baseUrl}users`;
    pipelines = `${this.baseUrl}leads/pipelines`;
    leadsWithContacts = `${this.baseUrl}leads?with=contacts`;

    legend = {
        'leads': this.leadsWithContacts,
        'contacts': this.contacts,
        'users': this.users,
        'pipelines': this.pipelines
    }

    getAllLeads() {
        return this.get(this.baseUrl + 'leads?with=contacts');
    }

    findById() {

    }

    async get(url) {
///        return await lastValueFrom(this.httpService.get(url, {headers: this.headers})
        console.log(this.headers())
        return await lastValueFrom(this.httpService.get(url, {headers: this.headers()})
            .pipe(map(res => res.data)))
 ///           .toPromise();          
    }

    async pipelineID() { 
        let res = await this.get(this.baseUrl + 'leads/pipelines');
        let ids = res['_embedded'].pipelines;

        return ids;
    }
    
    async leadsID(): Promise<any[]> {
        let leadsArray = await this.get(this.baseUrl + 'leads');
        return leadsArray['_embedded'].leads.map(lead => lead['status_id']);
    }
    
    async statusesID () {
        let pipelines = await this.pipelineID();
        let ids = pipelines.map(pipeline => pipeline.id);

        let leadsAll = await this.getAllLeads();
        let leads = leadsAll['_embedded'].leads;

        let paths = ids.map(id => `${this.baseUrl}leads/pipelines/${id}`);

        let statusesAll = await Promise.all(paths.map(path => this.get(`${path}}`)));

        let statuses = statusesAll.map(pipeline => pipeline['_embedded'].statuses);       // statuses

        let pipelinesWithLeads = [];

        pipelines.forEach(pipeline => {
            let obj = {name: pipeline.name, id: pipeline.id, leads: []};
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
///        console.log(statuses[0])

        leads.forEach(lead => {
            pipelines.forEach(pipeline => {
                if (lead['pipeline_id'] === pipeline['id']) {
                    lead['pipelineName'] = pipeline.name;
                }
            })
        })

        return leads;
    }

    async formatLeads() {
        let res = await this.statusesID();
        let formatted = res.map(lead => {
            return {
                externalId: lead.id, 
                name: lead.name,
                budget: lead.price,
                responsibleuserid: lead['responsible_user_id'],
                statusid: lead['status_id'],
                statusname: lead.statusName,
                statuscolor: lead.statusColor,
                pipelinename: lead.pipelineName,
                createdAt: lead['created_at']
            }
        })

///        console.log(res[0])
        return formatted;
    }

    async createLead(lead: Leads): Promise<InsertResult> {
        return this.leadsRepository.insert(lead);
    }

    async updateLead(previousLead: Leads, newLead: Leads): Promise<UpdateResult> {
        return this.leadsRepository.update({externalId: previousLead.externalId}, newLead);
    }

    async findAllLeads(): Promise<Leads[]> {
        return await this.leadsRepository.find();
    }

    async getAll() {
        let obj = {};
    
        for await (let key of Object.keys(this.legend)) {
            try {
                let data = await this.get(this.legend[key]);
                obj[key] = this.parseData(data, key);
            } catch (e) {
                console.log(2);
                console.log(e);
            }
        }
    
        return obj;
    }

    parseData(data, key) {
        let array = data['_embedded'][key];
    
        return array;
    }

    formatData(obj) {
        let data = [];
    
        for (let i = 0; i < obj.leads.length; i++) {
            let leadObj = obj.leads[i];
            console.log(leadObj)
    
            let userObj = obj.users.filter(user => user.id == leadObj['responsible_user_id'])[0];
            let contactID = leadObj['_embedded']['contacts'][0]['id'];
            let contactObj = obj.contacts.filter(contact => contact.id == contactID)[0];
            let customValues = contactObj['custom_fields_values'];
    
            let phone = '';
            let mail = '';
    
            for (let j = 0; j < customValues.length; j++) {
                let field = customValues[j];
    
                if (field['field_code'] == 'PHONE') {
                    phone = field.values[0].value
                } 
                if (field['field_code'] == 'EMAIL') {
                    mail = field.values[0].value;
                }
            }
    
            let contact = {name: contactObj.name, mail, phone};
            let lead = {title: leadObj.name, price: leadObj.price, contact, user: userObj.name, createdAt: leadObj['created_at']};
    
            data.push(lead);
        }
    
        console.log(data);
    
        return data;
    }

    async search(str) {
        let all = await this.findAllLeads();
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

    async auth2() {
        const requestConfig: AxiosRequestConfig = {
            headers: {
              'Content-Type': 'application/json',
            }
          };

        const data = {
            'client_id': 'd52f7009-6310-4b6a-9215-e3fe5c00fe45',
            'client_secret': 'RkvLVHCKWtqsOqQSMq7bhMaQcCvONUERNT54CQ1hhkfOrHIml5hcsiFJMie0t8oy',
            'grant_type': 'refresh_token',
            'refresh_token': 'def50200da29ee77292af9f9806339c2001381940d7ebb218df3c713e32948e03bfe5ef197706df977d6a1cad742808f08792bea90b4139f82139d7c9b30bf2931b91a794d9e02c513aedbeff338f149eef4e90cf89c4fb68e7fbf26579ddbf7d4c960ec0ea05f3dd7c5d8bfcd66682a19caa139f093f6bfe05535af4307b0792e3363b1b52abddac7f6a30c81c7a60e24391bd2652aa47acb5340057979ec530fecfe57017570f231fd232a70c85bb59c45f7962a52c93089fa228494bbe9d574d96bc0f297dbda547462ceebee640709dc11d3fd9010e508905f94c8cd1c837c2973695c93a32ef778acdaa428c4a745d843e6391c69d4c99945d75e38abaeeb5d5f082ddfde71787e2605f791a31e049b922dc012766a620d80625e7e73f66c64ce1cd90c86f86a89401f5cf9d5eacd1ebb691dbbf04ac287ecf5dfa8e5e05e8bc85baf9b93218572020ae54358d70b0e7deead3b482371aaa44179aa5f77e54dd272ab46e3303e35b1bdcaa1a3217ab8667e09e351aabf16082574bafd3e3290daabf8389f220164e785c3c5f861c11901f755feaa77cd70d21163ab99c9d2a7a2c190abc710dc4b8d88ede0b5ba95b149b47737c48dea8f896a5dbd930e9d047a618719b0a8b2ef',
            'redirect_uri': 'https://example.org'
        };

        const responseData = await lastValueFrom(
            this.httpService.post('https://new1641839342.amocrm.ru/oauth2/access_token/', data, requestConfig).pipe(
              map((response) => {
                return response.data;
              }),
            ),
          );
        
        return responseData;
    }

    async getAllWithStatuses() {
        let leads =  await this.formatLeads();
        let previous = await this.findAllLeads();

        leads.forEach(lead => {
            previous.forEach((pre, i) => {
                if (pre.externalId === lead.externalId) {
                    let keys = Object.keys(lead);
                    
                    for (let i = 0; i < keys.length; i++) {
                        let key = keys[i];
                        let valuePre = pre[key];
                        let valueNow = lead[key];

                        if (valueNow !== valuePre) {
                            this.updateLead(pre, lead);
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
            this.createLead(lead)
        })
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    handleCron() {
        console.log('this interval', 1)
        this.getAllWithStatuses();
    }

}
