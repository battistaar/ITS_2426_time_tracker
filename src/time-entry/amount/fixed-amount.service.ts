import { Injectable } from "@nestjs/common";
import { AmountService } from "./amount.service";

@Injectable()
export class FixedAmountService extends AmountService {
  calcAmount(duration: number): number {
    return Math.max(0, duration * 60);
  }

}
