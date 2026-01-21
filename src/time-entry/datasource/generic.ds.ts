export abstract class DataSource<T> {
  abstract list(): Promise<T[]>;
  abstract get(id: string): Promise<T | null>;
  abstract add(data: Partial<T>): Promise<T>;
}
