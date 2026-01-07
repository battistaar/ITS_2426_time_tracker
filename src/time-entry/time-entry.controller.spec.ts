import { Test, TestingModule } from "@nestjs/testing";
import { TimeEntryController } from "./time-entry.controller";
import { TimeEntryMockDataSource } from "./datasource/time-entry.ds.mock";
import { TimeEntryDataSource } from "./datasource/time-entry.ds";
import { Types } from 'mongoose';
import { TimeEntry } from "./time-entry.schema";
import { ExactDurationService } from "./duration/exact-duration.service";
import { DurationService } from "./duration/duration.service";
import { AmountService } from "./amount/amount.service";
import { FixedAmountService } from "./amount/fixed-amount.service";

describe('TimeEntryController', () => {
  let controller: TimeEntryController;
  let dataSource: TimeEntryMockDataSource;
  let durationSrv: DurationService;
  let amountSrv: AmountService;

  beforeEach(async () => {
    dataSource = new TimeEntryMockDataSource();
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TimeEntryController],
      providers: [
        {
          provide: TimeEntryDataSource,
          useValue: dataSource
        },
        {
          provide: DurationService,
          useClass: ExactDurationService
        },
        {
          provide: AmountService,
          useClass: FixedAmountService
        }
      ]
    }).compile();

    controller = app.get<TimeEntryController>(TimeEntryController);
    durationSrv = app.get<DurationService>(DurationService);
    amountSrv = app.get<AmountService>(AmountService);
  })

  describe('list', () => {
    it('should return a list of elements', async () => {
      dataSource.setRecords([
        {
          id: new Types.ObjectId().toHexString(),
          description: 'Test1',
          start: new Date(),
          end: new Date(),
          billable: true
        },
        {
          id: new Types.ObjectId().toHexString(),
          description: 'Test2',
          start: new Date(),
          end: new Date(),
          billable: true
        }
      ])
      const results = await controller.list();
      expect(results.length).toBeGreaterThan(0);
    });

    it('should calculate billable amounts"', async () => {
      const records: TimeEntry[] = [
        {
          id: new Types.ObjectId().toHexString(),
          description: 'Test1',
          start: new Date('2024-01-10T10:00:00.000Z'),
          end: new Date('2024-01-10T11:00:00.000Z'),
          billable: true
        },
        {
          id: new Types.ObjectId().toHexString(),
          description: 'Test2',
          start: new Date('2024-01-10T11:00:00.000Z'),
          end: new Date('2024-01-10T13:00:00.000Z'),
          billable: false
        },

        {
          id: new Types.ObjectId().toHexString(),
          description: 'Test2',
          start: new Date('2024-01-13T10:00:00.000Z'),
          end: new Date('2024-01-14T10:00:00.000Z'),
          billable: true
        }
      ];
      dataSource.setRecords(records);
      const durationSpy = jest.spyOn(durationSrv, 'getDuration');
      const amountSpy = jest.spyOn(amountSrv, 'calcAmount');

      const result = await controller.list();
      expect(durationSpy).toHaveBeenCalledTimes(3);
      for (let i = 0; i < records.length; i++) {
        expect(durationSpy).toHaveBeenNthCalledWith(i + 1, records[i].start, records[i].end);
      }

      expect(amountSpy).toHaveBeenCalledTimes(2);

      expect(result[0].amount).toBeGreaterThan(0);
      expect(result[1].amount).toBe(0);
      expect(result[2].amount).toBeGreaterThan(0);

    });

  });

  describe('detail', () => {
    it('should return a single record with amount"', async () => {
      const records: TimeEntry[] = [
        {
          id: new Types.ObjectId().toHexString(),
          description: 'Test1',
          start: new Date(),
          end: new Date(),
          billable: true
        },
        {
          id: new Types.ObjectId().toHexString(),
          description: 'Test2',
          start: new Date(),
          end: new Date(),
          billable: true
        }
      ];
      dataSource.setRecords(records);
      const durationSpy = jest.spyOn(durationSrv, 'getDuration');
      const result = await controller.detail(records[1].id);
      expect(durationSpy).toHaveBeenCalledWith(records[1].start, records[1].end);

      expect(result.id).toBe(records[1].id);
      expect(result.amount).toBeDefined();
    });

    it('should calculate billable amounts"', async () => {
      const records: TimeEntry[] = [
        {
          id: new Types.ObjectId().toHexString(),
          description: 'Test1',
          start: new Date('2024-01-10T10:00:00.000Z'),
          end: new Date('2024-01-10T11:00:00.000Z'),
          billable: true
        }
      ];
      dataSource.setRecords(records);

      return controller.detail(records[0].id.toString()).then(result => {
        expect(result.amount).toBeGreaterThan(0);
      })
    });
    it('should leave non billable amounts to 0"', async () => {
      const records: TimeEntry[] = [
        {
          id: new Types.ObjectId().toHexString(),
          description: 'Test1',
          start: new Date('2024-01-10T10:00:00.000Z'),
          end: new Date('2024-01-10T11:00:00.000Z'),
          billable: false
        }
      ];
      dataSource.setRecords(records);

      return controller.detail(records[0].id.toString()).then(result => {
        expect(result.amount).toBe(0);
      })
    });

    it('should throw an exception if not found"', async () => {
      const records: TimeEntry[] = [
        {
          id: new Types.ObjectId().toHexString(),
          description: 'Test1',
          start: new Date('2024-01-10T10:00:00.000Z'),
          end: new Date('2024-01-10T11:00:00.000Z'),
          billable: false
        }
      ];
      dataSource.setRecords(records);
      return expect(controller.detail('test')).rejects.toThrow('Not found');
    });

  });

  describe('create', () => {
    it('should add a new billable record', async () => {
      const record = {
        description: 'Test1',
        start: new Date('2024-01-10T10:00:00.000Z'),
        end: new Date('2024-01-10T11:00:00.000Z'),
        billable: true
      }
      return controller.create(record).then(result =>{
        expect(result.id).toBeDefined();
        expect(result.description).toBe(record.description);
        expect(result.billable).toBe(true);
        expect(result.amount).toBeGreaterThan(0);
      })
    });

    it('should add a new non billable record', async () => {
      const record = {
        description: 'Test1',
        start: new Date('2024-01-10T10:00:00.000Z'),
        end: new Date('2024-01-10T11:00:00.000Z'),
        billable: false
      }
      return controller.create(record).then(result =>{
        expect(result.id).toBeDefined();
        expect(result.description).toBe(record.description);
        expect(result.billable).toBe(false);
        expect(result.amount).toBe(0);
      })
    });
  })
});
