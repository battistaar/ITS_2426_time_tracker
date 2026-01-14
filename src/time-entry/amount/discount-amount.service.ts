import { AmountServiceDecorator } from "./amount-service.decorator";
import { AmountService } from "./amount.service";

export class DiscountAmountService extends AmountServiceDecorator {
  constructor(
    base: AmountService,
    private discounts: {hours: number, discount: number}[]
  ) {
    super(base);
  }

  calcAmount(duration: number): number {
    const baseAmount = super.calcAmount(duration);

    let result = baseAmount;
    for(const disc of this.discounts) {
      if (duration >= disc.hours) {
        result = baseAmount * (1 - disc.discount);
      }
    }

    return result;
  }

}
