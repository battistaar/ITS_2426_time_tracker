import { CalculatedTimeEntry } from "../time-entry.entity";
import { TimeEntry } from "../time-entry.schema";

export type TimeEntryResultFn = (data: TimeEntry) => CalculatedTimeEntry;
