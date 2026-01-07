import { Injectable } from "@nestjs/common";
import { DurationService } from "./duration.service";

@Injectable()
export class ExactDurationService extends DurationService {
  getDuration(start: Date, end: Date): number {
    const millis = end.getTime() - start.getTime();
    return millis / (1000 * 60 * 60);
  }
}
