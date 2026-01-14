import { AmountService } from "./amount.service";

export class AmountServiceDecorator extends AmountService {
  private base: AmountService

  constructor(base: AmountService) {
    super();
    this.base = base;
  }

  calcAmount(duration: number): number {
    return this.base.calcAmount(duration);
  }
}
