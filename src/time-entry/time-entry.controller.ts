import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TimeEntry, TimeEntryDocument } from './time-entry.schema';
import { Model } from 'mongoose';
import { CalculatedTimeEntry } from './time-entry.entity';
import { CreateTimeEntryDTO } from './time-entry.dto';

@Controller('time-entries')
export class TimeEntryController {
  constructor(
    @InjectModel(TimeEntry.name)
    private readonly timeEntryModel: Model<TimeEntry>,
  ) {}

  @Get()
  async list(): Promise<CalculatedTimeEntry[]> {
    const list: TimeEntryDocument[] = await this.timeEntryModel.find();

    return list.map((e) => {
      const duration = (e.end.getTime() - e.start.getTime()) / (1000 * 60 * 60);
      return {
        ...e.toObject(),
        amount: e.billable ? duration * 60 : 0,
      };
    });
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const record: TimeEntryDocument | null = await this.timeEntryModel.findById(id);
    if (!record) {
      throw new HttpException('Not fount', HttpStatus.NOT_FOUND);
    }
    const duration = (record.end.getTime() - record.start.getTime()) / (1000 * 60 * 60);
    return {
      ...record.toObject(),
      amount: record.billable ? duration * 60 : 0,
    };
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createTimeEntryDTO: CreateTimeEntryDTO) {
    const record: TimeEntryDocument = await this.timeEntryModel.create(createTimeEntryDTO);
    const duration = (record.end.getTime() - record.start.getTime()) / (1000 * 60 * 60);
    return {
      ...record.toObject(),
      amount: record.billable ? duration * 60 : 0,
    };
  }
}
