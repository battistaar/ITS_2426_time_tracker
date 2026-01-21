import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TimeEntryAmountSettings } from './amount/datasource/entities';

export type TimeEntryDocument = HydratedDocument<TimeEntry>;

@Schema()
export class TimeEntry {
  id: string;

  @Prop()
  description: string;

  @Prop()
  start: Date;

  @Prop()
  end: Date;

  @Prop()
  billable: boolean;

  settings: {
    amount: TimeEntryAmountSettings
  };
  project: string;
  user: string;
  company: string;
}

export const TimeEntrySchema = SchemaFactory.createForClass(TimeEntry);
