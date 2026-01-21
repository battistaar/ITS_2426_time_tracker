import { AmountSettings } from '../amount-settings.entity';
import { ProjectAmountSettingsDS } from './amount-settings-project.ds';
import { AmountSettingsDS } from './amount-settings.ds';

export class ProjectAmountSettingsAdapter extends AmountSettingsDS {
  constructor(protected baseDs: ProjectAmountSettingsDS, protected userId: string) {
    super();
  }

  getAmountSettings(entityId: string): Promise<AmountSettings> {
    return this.baseDs.getAmountSettings(entityId, this.userId);
  }
}
