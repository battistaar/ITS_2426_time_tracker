export abstract class DurationService {
  abstract getDuration(start: Date, end: Date): number;
}
