import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Leads } from "src/entities/Leads";
import { InsertResult, Repository } from "typeorm";


@Injectable()
export class DatabaseService {
  constructor(@InjectRepository(Leads) private readonly leadsRepository: Repository<Leads>) {}

  async getAll(): Promise<Leads[]> {
    return await this.leadsRepository.find();
  }

  async getCount(): Promise<Number> {
    return await this.leadsRepository.count();
  }

  async createLead(lead: Leads): Promise<InsertResult> {
//    return await this.userRepository.create(user);
    return this.leadsRepository.insert(lead);
  }
/*
  async getByName(name: string): Promise<Leads[] | Leads> {
    return await this.userRepository.find({firstname: name});
  }

  async getById(id: number) {
    return await this.userRepository.findOne(id);
  }*/
}