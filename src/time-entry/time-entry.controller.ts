import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { TimeEntry } from './time-entry.schema';
import { CalculatedTimeEntry } from './time-entry.entity';
import { CreateTimeEntryDTO } from './time-entry.dto';
import { TimeEntryDataSource } from './datasource/time-entry.ds';
import { DurationService } from './duration/duration.service';
import { AmountService } from './amount/amount.service';
import { TimeEntryResultFn } from './result-factory/result-fn';
import { ResultFnFactory } from './result-factory/result-fn-factory';
import { DurationSettings } from './duration/duration-settings.entity';
import { ExactDurationService } from './duration/exact-duration.service';
import { RoundedDurationService } from './duration/rounded-duration.service';
import { DurationSettingsDS } from './duration/datasource/duration-settings.ds';
import { DurationStrategySelector } from './duration/duration-strategy-selector';

const hourlyRate = 60;

@Controller('time-entries')
export class TimeEntryController {
  constructor(
    protected readonly dataSource: TimeEntryDataSource,
    protected readonly amountSrv: AmountService,
    protected readonly resultFnFactory: ResultFnFactory,
    protected readonly durationSettingsDs: DurationSettingsDS,
    protected readonly durationStrategySelector: DurationStrategySelector
  ) {}

  @Get()
  async list(): Promise<CalculatedTimeEntry[]> {
    const list: TimeEntry[] = await this.dataSource.list();

    const durationSettings: DurationSettings = await this.durationSettingsDs.getDurationSettings();

    const durationSrv: DurationService =
      this.durationStrategySelector.getStrategy(durationSettings.strategy);

    const resultFn = this.resultFnFactory.getResultFactory(durationSrv, this.amountSrv);

    return list.map((e) => resultFn(e));
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const record: TimeEntry | null = await this.dataSource.get(id);
    if (!record) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const durationSettings: DurationSettings = await this.durationSettingsDs.getDurationSettings();

    const durationSrv: DurationService =
      this.durationStrategySelector.getStrategy(durationSettings.strategy);

    const resultFn: TimeEntryResultFn = this.resultFnFactory.getResultFactory(durationSrv, this.amountSrv);

    return resultFn(record);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createTimeEntryDTO: CreateTimeEntryDTO) {
    const record: TimeEntry = await this.dataSource.add(createTimeEntryDTO);

    const durationSettings: DurationSettings = await this.durationSettingsDs.getDurationSettings();

    const durationSrv: DurationService =
      this.durationStrategySelector.getStrategy(durationSettings.strategy);


    const resultFn = this.resultFnFactory.getResultFactory(durationSrv, this.amountSrv);

    return resultFn(record);
  }
}
