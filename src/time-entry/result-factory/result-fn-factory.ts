import { AmountService } from "../amount/amount.service";
import { DurationService } from "../duration/duration.service";
import { TimeEntryResultFn } from "./result-fn";

export abstract class ResultFnFactory {
  abstract getResultFactory(durationSrv: DurationService, amountSrv: AmountService): TimeEntryResultFn;
}
