import { Injectable } from '@nestjs/common';
import { TimeEntry } from './time-entry.schema';
import { CreateTimeEntryDTO } from './time-entry.dto';
import { Types } from 'mongoose';

@Injectable()
export class TimeEntryMockDataSource {
  protected data: TimeEntry[] = [];

  constructor(data?: TimeEntry[]) {
    if (data) {
      this.setRecords(data);
    }
  }

  setRecords(data: TimeEntry[]) {
    this.data = data;
  }

  async list(): Promise<TimeEntry[]> {
    return this.data;
  }

  async get(id: string): Promise<TimeEntry | null> {
    return this.data.find((e) => e.id === id) ?? null;
  }

  async add(data: CreateTimeEntryDTO): Promise<TimeEntry> {
    const id: string = new Types.ObjectId().toHexString();
    const record = {
      ...data,
      id,
    };
    this.data.push(record);

    return record;
  }
}
