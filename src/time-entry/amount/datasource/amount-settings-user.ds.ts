import { AmountSettings } from "../amount-settings.entity";
import { User } from "./entities";
import { AmountSettingsMerger } from "./amount-settings-merger";

export class UserAmountSettingsDS extends AmountSettingsMerger<User> {

  extractSettings(entity: User): Partial<AmountSettings> {
    return entity.settings.amount;
  }
}
