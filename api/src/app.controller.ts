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

  @Get('test')
  async test() {
    return await this.appService.getAll()
  }

  @Get('all')
  async allWithLeads() {
    return await this.appService.getAll();
  }

  @Get('search/:query')
  search(@Param('query') query) {
    return this.appService.search2(query.toLowerCase());
  }
}
