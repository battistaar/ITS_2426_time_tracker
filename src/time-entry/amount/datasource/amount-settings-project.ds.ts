import { DataSource } from "../../datasource/generic.ds";
import { AmountSettings } from "../amount-settings.entity";
import { AmountSettingsDS } from "./amount-settings.ds";
import { Project } from "./entities";

export class ProjectAmountSettingsDS {
  constructor(
      protected ds: DataSource<Project>,
      protected parent?: AmountSettingsDS,
      protected getPrevId?: (entity: Project) => string
    ) { }

  async getAmountSettings(entityId: string, userId: string): Promise<AmountSettings> {
    const entity: Project | null = await this.ds.get(entityId);
    if (!entity) {
      throw new Error('Missing entity');
    }
    let prevSettings: AmountSettings = {} as AmountSettings;
    if (!!this.parent && !!this.getPrevId) {
      const prevEntityId = this.getPrevId(entity);
      prevSettings = await this.parent.getAmountSettings(prevEntityId);
    }

    const projectUserSettings = entity.settings.amount.userSettings.find(i => i.userId === userId);
    const projectSettings = projectUserSettings ? projectUserSettings.settings : {};
    return Object.assign(prevSettings, projectSettings);
  }
}
