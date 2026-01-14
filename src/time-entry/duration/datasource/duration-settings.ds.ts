import { Injectable } from "@nestjs/common";
import { DurationSettings } from "../duration-settings.entity";

@Injectable()
export abstract class DurationSettingsDS {
  abstract getDurationSettings(): Promise<DurationSettings>;
}
