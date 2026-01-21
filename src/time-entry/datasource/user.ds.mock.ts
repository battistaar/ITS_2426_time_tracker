import { Injectable } from "@nestjs/common";
import { DataSource } from "./generic.ds";
import { User } from "../amount/datasource/entities";

@Injectable()
export class MockUserDS extends DataSource<User> {
  list(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  get(id: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  add(data: User): Promise<User> {
    throw new Error("Method not implemented.");
  }

}
