import { DurationSettings } from "../duration-settings.entity";
import { DurationSettingsDS } from "./duration-settings.ds";

export class DurationSettingsStaticDS extends DurationSettingsDS {

  async getDurationSettings(): Promise<DurationSettings> {
    return {
      strategy: 'exact'
    };
  }

}
