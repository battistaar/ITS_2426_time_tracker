import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeEntry, TimeEntrySchema } from './time-entry.schema';
import { TimeEntryController } from './time-entry.controller';
import { TimeEntryDataSource } from './datasource/time-entry.ds';
import { TimeEntryMongoDataSource } from './datasource/time-entry.ds.mongo';

@Module({
  imports: [MongooseModule.forFeature([{ name: TimeEntry.name, schema: TimeEntrySchema }])], //
  controllers: [TimeEntryController],
  providers: [
    {
      provide: TimeEntryDataSource,
      useClass: TimeEntryMongoDataSource
    },
  ],
})
export class TimeEntryModule {}
