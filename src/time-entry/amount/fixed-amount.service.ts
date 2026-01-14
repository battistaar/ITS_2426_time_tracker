import { Injectable } from "@nestjs/common";
import { AmountService } from "./amount.service";

export class FixedAmountService extends AmountService {
  constructor(protected hourlyRate: number = 60) {
    super();
  }

  calcAmount(duration: number): number {
    return Math.max(0, duration * this.hourlyRate);
  }

}
