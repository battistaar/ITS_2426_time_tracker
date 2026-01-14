import { Injectable } from "@nestjs/common";
import { DurationService } from "./duration.service";

@Injectable()
export class RoundedDurationService extends DurationService {
  getDuration(start: Date, end: Date): number {
    const millis = end.getTime() - start.getTime();
    const minutes = millis / (1000 * 60);
    const rounded = Math.round(minutes / 30) * 30;

    return rounded / 60;
  }
}
