import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { TimeEntry } from './time-entry.schema';
import { CalculatedTimeEntry } from './time-entry.entity';
import { CreateTimeEntryDTO } from './time-entry.dto';
import { TimeEntryDataSource } from './time-entry.ds.service';

const hourlyRate = 60;

@Controller('time-entries')
export class TimeEntryController {
  constructor(protected readonly dataSource: TimeEntryDataSource) {}

  @Get()
  async list(): Promise<CalculatedTimeEntry[]> {
    const list: TimeEntry[] = await this.dataSource.list();

    return list.map((e) => {
      const duration = (e.end.getTime() - e.start.getTime()) / (1000 * 60 * 60);
      return {
        ...e,
        amount: e.billable ? duration * hourlyRate : 0,
      };
    });
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const record: TimeEntry | null = await this.dataSource.get(id);
    if (!record) {
      throw new HttpException('Not fount', HttpStatus.NOT_FOUND);
    }
    const duration = (record.end.getTime() - record.start.getTime()) / (1000 * 60 * 60);
    return {
      ...record,
      amount: record.billable ? duration * hourlyRate : 0,
    };
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createTimeEntryDTO: CreateTimeEntryDTO) {
    const record: TimeEntry = await this.dataSource.add(createTimeEntryDTO);
    const duration = (record.end.getTime() - record.start.getTime()) / (1000 * 60 * 60);
    return {
      ...record,
      amount: record.billable ? duration * hourlyRate : 0,
    };
  }
}
