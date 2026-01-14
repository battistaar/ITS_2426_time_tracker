import { Injectable } from "@nestjs/common";
import { DurationService } from "./duration.service";

@Injectable()
export class DurationStrategySelector {
  protected strategies: { [key: string]: DurationService } = {};

  addStrategy(identifier: string, strategy: DurationService) {
    this.strategies[identifier] = strategy;
  }

  getStrategy(identifier: string): DurationService {
    if (!this.strategies[identifier]) {
      throw new Error(`Duration strategy ${identifier} not found`);
    }
    return this.strategies[identifier];
  }
}
