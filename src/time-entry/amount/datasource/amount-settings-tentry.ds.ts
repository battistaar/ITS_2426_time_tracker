import { TimeEntry } from "../../time-entry.schema";
import { AmountSettings } from "../amount-settings.entity";
import { AmountSettingsMerger } from "./amount-settings-merger";

export class TimeEntryAmountSettingsDS extends AmountSettingsMerger<TimeEntry> {

  extractSettings(entity: TimeEntry): Partial<AmountSettings> {
    return entity.settings.amount;
  }
}
