import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TimeEntryDocument = HydratedDocument<TimeEntry>;

@Schema()
export class TimeEntry {
  @Prop()
  description: string;

  @Prop()
  start: Date;

  @Prop()
  end: Date;

  @Prop()
  billable: boolean;
}

export const TimeEntrySchema = SchemaFactory.createForClass(TimeEntry);
