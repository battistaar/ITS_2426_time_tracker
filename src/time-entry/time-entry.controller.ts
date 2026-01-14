import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { TimeEntry } from './time-entry.schema';
import { CalculatedTimeEntry } from './time-entry.entity';
import { CreateTimeEntryDTO } from './time-entry.dto';
import { TimeEntryDataSource } from './datasource/time-entry.ds';
import { ResultCalculator } from './result-calculator.service';

const FAKE_USER_ID = '1234';

@Controller('time-entries')
export class TimeEntryController {
  constructor(
    protected readonly dataSource: TimeEntryDataSource,
    protected resultCalculator: ResultCalculator
  ) {}

  @Get()
  async list(): Promise<CalculatedTimeEntry[]> {
    const list: TimeEntry[] = await this.dataSource.list();

    return this.resultCalculator.calcResult(FAKE_USER_ID, list);
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const record: TimeEntry | null = await this.dataSource.get(id);
    if (!record) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return this.resultCalculator.calcResult(FAKE_USER_ID, record);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createTimeEntryDTO: CreateTimeEntryDTO) {
    const record: TimeEntry = await this.dataSource.add(createTimeEntryDTO);

    return this.resultCalculator.calcResult(FAKE_USER_ID, record);
  }
}
