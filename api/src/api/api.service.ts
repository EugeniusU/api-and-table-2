import { Injectable } from '@nestjs/common';
import axios from 'axios'
import * as jwt from 'jsonwebtoken'
import * as fs from 'fs'

@Injectable()
export class ApiService {
    async get(url: string) {
        const tokens = await fs.promises.readFile('../tokens.json', 'utf8');

/*        const refreshToken = JSON.parse(tokens)['refresh_token'];
        let accessToken = JSON.parse(tokens)['access_token'];*/

        const tokensObj = JSON.parse(tokens);
        const refreshToken = tokensObj['refresh_token'];
        let accessToken = tokensObj['access_token'];

        const beforeUpdate = Date.now() - 60 * 1000;

        const exp = jwt.decode(accessToken).exp * 1000;
        console.log(exp)
        console.log((exp - beforeUpdate) / 1000 / 60)
        console.log(new Date(exp))

        const requestConfig = {
            headers: {
              'Content-Type': 'application/json',
            }
          };
        
        const updateUrl = 'https://new1641839342.amocrm.ru/oauth2/access_token/'

        const data = {
            'client_id': 'd52f7009-6310-4b6a-9215-e3fe5c00fe45',
            'client_secret': 'RkvLVHCKWtqsOqQSMq7bhMaQcCvONUERNT54CQ1hhkfOrHIml5hcsiFJMie0t8oy',
            'grant_type': 'refresh_token',
            'refresh_token': refreshToken,
            'redirect_uri': 'https://example.org'
          };

          const instance = axios.create()

          instance.interceptors.request.use(async config => {
            if (exp < beforeUpdate) {
                const d = await axios.post(updateUrl, data, requestConfig).then(async res => {
                    await fs.promises.writeFile('../tokens.json', JSON.stringify(res.data));
                    console.log('updated');
                    let tokens = await fs.promises.readFile('../tokens.json', 'utf8');
                    accessToken = JSON.parse(tokens)['access_token'];
                })

            } else {
                console.log('dont need update')
            }

            config.headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${await this.getToken()}}` }
            
            return config;
        }, async error => {
            return Promise.reject(error)
        })

    instance.interceptors.response.use(async response => {
            return response;
        }, async error => {
            return Promise.reject(error)
        })

        const headers = {headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${await this.getToken()}}` }}

        const res = await instance.get(url)
        return await res.data

        
    }

    async getToken() {
        const tokens = await fs.promises.readFile('../tokens.json', 'utf8');
        return JSON.parse(tokens)['access_token']
    }
}
