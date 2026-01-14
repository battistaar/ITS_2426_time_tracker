export interface HourlyRateSettings {
  hourlyRate: number;
}

export interface MinBillableSettings {
  minBillableDuration: number;
}

export interface DiscountSettings {
  discounts: {hours: number, discount: number}[];
}

export interface AmountSettings extends
  HourlyRateSettings,
  MinBillableSettings,
  DiscountSettings { }
