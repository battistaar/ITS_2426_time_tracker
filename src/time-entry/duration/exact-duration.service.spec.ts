import { ExactDurationService } from "./exact-duration.service"

describe('ExactDurationService', () => {
  let srv: ExactDurationService;

  beforeEach(() => {
    srv = new ExactDurationService();
  })

  it('should return 1', () => {
    const start = new Date('2026-01-07T12:00:00.000Z');
    const end = new Date('2026-01-07T13:00:00.000Z');
    const res = srv.getDuration(start, end);
    expect(res).toBe(1);
  })

  it('should return 0.25', () => {
    const start = new Date('2026-01-07T12:00:00.000Z');
    const end = new Date('2026-01-07T12:15:00.000Z');
    const res = srv.getDuration(start, end);
    expect(res).toBe(0.25);
  })

  it('should return 0', () => {
    const start = new Date('2026-01-07T12:00:00.000Z');
    const end = new Date('2026-01-07T12:00:00.000Z');
    const res = srv.getDuration(start, end);
    expect(res).toBe(0);
  })

  it('should return 0', () => {
    const start = new Date('2026-01-07T12:00:00.000Z');
    const end = new Date('2026-01-07T13:00:00.000Z');
    const res = srv.getDuration(end, start);
    expect(res).toBe(-1);
  })

});
