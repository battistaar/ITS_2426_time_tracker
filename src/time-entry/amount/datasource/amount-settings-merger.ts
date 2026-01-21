import { DataSource } from "src/time-entry/datasource/generic.ds";
import { AmountSettingsDS } from "./amount-settings.ds";
import { AmountSettings } from "../amount-settings.entity";

export abstract class AmountSettingsMerger<T> extends AmountSettingsDS {
  constructor(
    protected ds: DataSource<T>,
    protected parent?: AmountSettingsDS,
    protected getPrevId?: (entity: T) => string
  ) {
      super();
    }

    abstract extractSettings(entity: T): Partial<AmountSettings>;

    async getAmountSettings(entityId: string): Promise<AmountSettings> {
      const entity: T | null = await this.ds.get(entityId);
      if (!entity) {
        throw new Error('Missing entity');
      }
      let prevSettings: AmountSettings = {} as AmountSettings;
      if (!!this.parent && !!this.getPrevId) {
        const prevEntityId = this.getPrevId(entity);
        prevSettings = await this.parent.getAmountSettings(prevEntityId);
      }
      const settings = this.extractSettings(entity);
      return Object.assign(prevSettings, settings);
    }
}
