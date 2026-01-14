import { Injectable } from "@nestjs/common";
import { AmountSettings } from "./amount/amount-settings.entity";
import { AmountService } from "./amount/amount.service";
import { AmountSettingsDS } from "./amount/datasource/amount-settings.ds";
import { FixedAmountService } from "./amount/fixed-amount.service";
import { DurationSettingsDS } from "./duration/datasource/duration-settings.ds";
import { DurationSettings } from "./duration/duration-settings.entity";
import { DurationStrategySelector } from "./duration/duration-strategy-selector";
import { DurationService } from "./duration/duration.service";
import { TimeEntryResultFn } from "./result-factory/result-fn";
import { ResultFnFactory } from "./result-factory/result-fn-factory";
import { CalculatedTimeEntry } from "./time-entry.entity";
import { TimeEntry } from "./time-entry.schema";

@Injectable()
export class ResultCalculator {
  constructor(
    protected readonly resultFnFactory: ResultFnFactory,
    protected readonly durationSettingsDs: DurationSettingsDS,
    protected readonly amountSettingsDs: AmountSettingsDS,
    protected readonly durationStrategySelector: DurationStrategySelector
  ) {}

  protected async getDurationSrv(userId: string): Promise<DurationService> {
    const durationSettings: DurationSettings = await this.durationSettingsDs.getDurationSettings(userId);

    const durationSrv: DurationService =
      this.durationStrategySelector.getStrategy(durationSettings.strategy);

    return durationSrv;
  }

  protected async getAmountSrv(amountSettings: AmountSettings, duration: number): Promise<AmountService> {
    let amountSrv: AmountService = new FixedAmountService(amountSettings.hourlyRate);
    if (duration < amountSettings.minBillableDuration) {
      amountSrv = new FixedAmountService(0);
    }
    return amountSrv;
  }

  async calcResult(userId: string, item: TimeEntry[]): Promise<CalculatedTimeEntry[]>;
  async calcResult(userId: string, item: TimeEntry): Promise<CalculatedTimeEntry>;
  async calcResult(userId: string, item: TimeEntry | TimeEntry[]) {
    const isArray: boolean = Array.isArray(item);
    const items: TimeEntry[] = Array.isArray(item) ? item : [item];

    const durationSrv: DurationService = await this.getDurationSrv(userId);
    const amountSettings: AmountSettings = await this.amountSettingsDs.getAmountSettings(userId);

    let results: CalculatedTimeEntry[] = [];
    for (const element of items) {
      const duration = durationSrv.getDuration(element.start, element.end);
      const amountSrv: AmountService = await this.getAmountSrv(amountSettings, duration);

      const resultFn: TimeEntryResultFn = this.resultFnFactory.getResultFactory(durationSrv, amountSrv);
      results.push(resultFn(element));
    }

    return isArray ? results : results[0];
  }
}
