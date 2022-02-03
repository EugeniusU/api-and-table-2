import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
    constructor(private readonly apiService: ApiService) {}

    @Get('test')
    async test() {
        return await this.apiService.get('https://new1641839342.amocrm.ru/api/v4/contacts?with=leads')
    }
}
