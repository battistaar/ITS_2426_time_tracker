import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeEntry, TimeEntrySchema } from './time-entry.schema';
import { TimeEntryController } from './time-entry.controller';
import { TimeEntryDataSource } from './time-entry.ds.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: TimeEntry.name, schema: TimeEntrySchema }])], //
  controllers: [TimeEntryController],
  providers: [
    TimeEntryDataSource,
  ],
})
export class TimeEntryModule {}
