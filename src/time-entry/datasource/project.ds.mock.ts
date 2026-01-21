import { Injectable } from "@nestjs/common";
import { DataSource } from "./generic.ds";
import { Company, Project } from "../amount/datasource/entities";

@Injectable()
export class MockProjectDS extends DataSource<Project> {
  list(): Promise<Project[]> {
    throw new Error("Method not implemented.");
  }
  get(id: string): Promise<Project> {
    throw new Error("Method not implemented.");
  }
  add(data: Project): Promise<Project> {
    throw new Error("Method not implemented.");
  }

}
