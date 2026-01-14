import { Injectable } from "@nestjs/common";
import { CalculatedTimeEntry } from "../time-entry.entity";
import { TimeEntry } from "../time-entry.schema";
import { DurationService } from "../duration/duration.service";
import { AmountService } from "../amount/amount.service";
import { TimeEntryResultFn } from "./result-fn";
import { ResultFnFactory } from "./result-fn-factory";

@Injectable()
export class TimeEntryResultFactory extends ResultFnFactory {

  getResultFactory(durationSrv: DurationService, amountSrv: AmountService): TimeEntryResultFn {
    return (timeEntry: TimeEntry): CalculatedTimeEntry => {
      const duration = durationSrv.getDuration(timeEntry.start, timeEntry.end);
      return {
        ...timeEntry,
        amount: timeEntry.billable ? amountSrv.calcAmount(duration) : 0
      }
    }
  }

}
