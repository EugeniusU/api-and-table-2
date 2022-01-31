import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
///    this.init()
  }

  init() {
    console.log('init')
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('update')
  updateTable() {
    return this.appService.updateTable();
  }

  @Get('all')
  async allWithLeads() {
    return await this.appService.allWithLeads();
  }

  @Get('search/:query')
    search(@Param('query') query) {
        return this.appService.query(query.toLowerCase());
    }

}
