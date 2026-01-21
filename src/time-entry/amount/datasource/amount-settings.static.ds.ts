import { Inject } from "@nestjs/common";
import { AmountSettings } from "../amount-settings.entity";
import { AmountSettingsDS } from "./amount-settings.ds";

export const STATIC_HOURLY_RATE = 'STATIC_HOURLY_RATE';
export const STATIC_MIN_BILLABLE = 'STATIC_MIN_BILLABLE';

export class AmountSettingsStaticDS extends AmountSettingsDS {
  constructor(
    @Inject(STATIC_HOURLY_RATE) protected defaultHourlyRate: number,
    @Inject(STATIC_MIN_BILLABLE) protected defaultMinBillable: number) {
    super();
  }

  async getAmountSettings(entityId: string): Promise<AmountSettings> {
    return {
      hourlyRate: this.defaultHourlyRate,
      minBillableDuration: this.defaultMinBillable,
      discounts: []
    };
  }

}
