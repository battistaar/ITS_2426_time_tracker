import { AmountServiceDecorator } from "./amount-service.decorator";
import { AmountService } from "./amount.service";

export class CutoffAmountService extends AmountServiceDecorator {
  constructor(base: AmountService, private minDuration: number) {
    super(base);
  }

  calcAmount(duration: number): number {
    return duration >= this.minDuration ? super.calcAmount(duration) : 0;
  }

}
