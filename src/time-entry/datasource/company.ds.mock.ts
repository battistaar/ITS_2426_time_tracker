import { Injectable } from "@nestjs/common";
import { DataSource } from "./generic.ds";
import { Company } from "../amount/datasource/entities";

@Injectable()
export class MockCompanyDS extends DataSource<Company> {
  list(): Promise<Company[]> {
    throw new Error("Method not implemented.");
  }
  get(id: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  add(data: Company): Promise<Company> {
    throw new Error("Method not implemented.");
  }

}
