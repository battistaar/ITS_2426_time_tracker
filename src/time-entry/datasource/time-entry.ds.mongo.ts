import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TimeEntry } from '../time-entry.schema';
import { Model } from 'mongoose';
import { CreateTimeEntryDTO } from '../time-entry.dto';
import { TimeEntryDataSource } from './time-entry.ds';

@Injectable()
export class TimeEntryMongoDataSource extends TimeEntryDataSource {
  constructor(
    @InjectModel(TimeEntry.name)
    private readonly timeEntryModel: Model<TimeEntry>,
  ) {
    super();
  }

  async list(): Promise<TimeEntry[]> {
    return this.timeEntryModel.find().then(records => records.map((r) => r.toObject()));
  }

  async get(id: string): Promise<TimeEntry | null> {
    return this.timeEntryModel.findById(id).then(record => record ? record.toObject() : null);
  }

  async add(data: CreateTimeEntryDTO): Promise<TimeEntry> {
    const record = await this.timeEntryModel.create(data);
    return record.toObject();
  }
}
