import { CreateTimeEntryDTO } from "../time-entry.dto";
import { TimeEntry } from "../time-entry.schema";

export abstract class TimeEntryDataSource {
  abstract list(): Promise<TimeEntry[]>;
  abstract get(id: string): Promise<TimeEntry | null>;
  abstract add(data: CreateTimeEntryDTO): Promise<TimeEntry>;
}
