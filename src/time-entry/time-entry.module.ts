import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeEntry, TimeEntrySchema } from './time-entry.schema';
import { TimeEntryController } from './time-entry.controller';
import { TimeEntryDataSource } from './datasource/time-entry.ds';
import { TimeEntryMongoDataSource } from './datasource/time-entry.ds.mongo';
import { DurationService } from './duration/duration.service';
import { ExactDurationService } from './duration/exact-duration.service';
import { AmountService } from './amount/amount.service';
import { FixedAmountService } from './amount/fixed-amount.service';
import { TimeEntryResultFactory } from './result-factory/time-entry-result-factory';
import { ResultFnFactory } from './result-factory/result-fn-factory';
import { DurationSettingsDS } from './duration/datasource/duration-settings.ds';
import { DurationSettingsStaticDS } from './duration/datasource/duration-settings.static.ds';
import { DurationStrategySelector } from './duration/duration-strategy-selector';
import { RoundedDurationService } from './duration/rounded-duration.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: TimeEntry.name, schema: TimeEntrySchema }])], //
  controllers: [TimeEntryController],
  providers: [
    {
      provide: TimeEntryDataSource,
      useClass: TimeEntryMongoDataSource
    },
    {
      provide: DurationService,
      useClass: ExactDurationService
    },
    {
      provide: AmountService,
      useClass: FixedAmountService
    },
    {
      provide: ResultFnFactory,
      useClass: TimeEntryResultFactory
    },
    {
      provide: DurationSettingsDS,
      useClass: DurationSettingsStaticDS
    },
    {
      provide: DurationStrategySelector,
      useFactory: (exact, rounded) => {
        const srv = new DurationStrategySelector();
        srv.addStrategy('exact', exact);
        srv.addStrategy('rounded', rounded);
        return srv;
      },
      inject: [ExactDurationService, RoundedDurationService]
    }
  ],
})
export class TimeEntryModule {}
