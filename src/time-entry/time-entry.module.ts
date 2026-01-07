import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeEntry, TimeEntrySchema } from './time-entry.schema';
import { TimeEntryController } from './time-entry.controller';
import { TimeEntryDataSource } from './datasource/time-entry.ds';
import { TimeEntryMongoDataSource } from './datasource/time-entry.ds.mongo';
import { DurationService } from './duration/duration.service';
import { ExactDurationService } from './duration/exact-duration.service';

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
    }
  ],
})
export class TimeEntryModule {}
