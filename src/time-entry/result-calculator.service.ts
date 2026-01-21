import { CutoffAmountService } from './amount/cutoff-amount.service';
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
import { DiscountAmountService } from './amount/discount-amount.service';
import { CompanyAmountSettingsDS } from './amount/datasource/amount-settings-company.ds';
import { MockCompanyDS } from './datasource/company.ds.mock';
import { MockUserDS } from './datasource/user.ds.mock';
import { TimeEntryDataSource } from './datasource/time-entry.ds';
import { UserAmountSettingsDS } from './amount/datasource/amount-settings-user.ds';
import { Project, User } from './amount/datasource/entities';
import { TimeEntryAmountSettingsDS } from './amount/datasource/amount-settings-tentry.ds';
import { ProjectAmountSettingsDS } from './amount/datasource/amount-settings-project.ds';
import { MockProjectDS } from './datasource/project.ds.mock';
import { ProjectAmountSettingsAdapter } from './amount/datasource/amount-settings-project.adapter';

@Injectable()
export class ResultCalculator {
  constructor(
    protected readonly resultFnFactory: ResultFnFactory,
    protected readonly durationSettingsDs: DurationSettingsDS,
    protected readonly durationStrategySelector: DurationStrategySelector,
    protected readonly companyDs: MockCompanyDS,
    protected readonly userds: MockUserDS,
    protected readonly projectDs: MockProjectDS,
    protected readonly timeEntryDs: TimeEntryDataSource
  ) {}

  protected async getDurationSrv(userId: string): Promise<DurationService> {
    const durationSettings: DurationSettings = await this.durationSettingsDs.getDurationSettings(userId);

    const durationSrv: DurationService =
      this.durationStrategySelector.getStrategy(durationSettings.strategy);

    return durationSrv;
  }

  protected async getAmountSrv(amountSettings: AmountSettings): Promise<AmountService> {
    let amountSrv: AmountService = new FixedAmountService(amountSettings.hourlyRate);
    if (amountSettings.minBillableDuration) {
      amountSrv = new CutoffAmountService(amountSrv, amountSettings.minBillableDuration);
    }
    amountSrv = new DiscountAmountService(amountSrv, amountSettings.discounts);

    return amountSrv;
  }

  protected getAmountSettingsDs(userId: string): AmountSettingsDS {
    let base: AmountSettingsDS = new CompanyAmountSettingsDS(this.companyDs);
    base = new UserAmountSettingsDS(this.userds, base, (entity: User) => entity.company);

    const pDs = new ProjectAmountSettingsDS(this.projectDs, base, (entity: Project) => userId);

    base = new ProjectAmountSettingsAdapter(pDs, userId);
    base = new TimeEntryAmountSettingsDS(this.timeEntryDs, base, (entity: TimeEntry) => entity.project);
    return base;
  }

  async calcResult(userId: string, item: TimeEntry[]): Promise<CalculatedTimeEntry[]>;
  async calcResult(userId: string, item: TimeEntry): Promise<CalculatedTimeEntry>;
  async calcResult(userId: string, item: TimeEntry | TimeEntry[]) {
    const isArray: boolean = Array.isArray(item);
    const items: TimeEntry[] = Array.isArray(item) ? item : [item];

    const durationSrv: DurationService = await this.getDurationSrv(userId);

    const amountSettingsDs = this.getAmountSettingsDs(userId);

    let results: CalculatedTimeEntry[] = [];
    for (const element of items) {
      const amountSettings: AmountSettings = await amountSettingsDs.getAmountSettings(element.id);

      const amountSrv: AmountService = await this.getAmountSrv(amountSettings);

      const resultFn: TimeEntryResultFn = this.resultFnFactory.getResultFactory(durationSrv, amountSrv);
      results.push(resultFn(element));
    }

    return isArray ? results : results[0];
  }
}
