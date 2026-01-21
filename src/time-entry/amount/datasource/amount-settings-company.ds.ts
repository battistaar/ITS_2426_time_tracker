import { DataSource } from "src/time-entry/datasource/generic.ds";
import { AmountSettings } from "../amount-settings.entity";
import { AmountSettingsDS } from "./amount-settings.ds";
import { Company } from "./entities";

export class CompanyAmountSettingsDS extends AmountSettingsDS {
  constructor(protected ds: DataSource<Company>) {
    super();
  }

  async getAmountSettings(entityId: string): Promise<AmountSettings> {
    const entity: Company | null = await this.ds.get(entityId);
    if (!entity) {
      throw new Error('Missing entity');
    }
    return entity.settings.amount;
  }

}
