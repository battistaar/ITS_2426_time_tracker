import { FixedAmountService } from "./fixed-amount.service"

describe('FixedAmountService', () => {
  let amountSrv: FixedAmountService;
  beforeAll(() => {
    amountSrv = new FixedAmountService();
  })

  it('should return 60', () => {
    const amount = amountSrv.calcAmount(1);
    expect(amount).toBe(60);
  })

  it('should return 72', () => {
    const amount = amountSrv.calcAmount(1.2);
    expect(amount).toBe(72);
  })

  it('should return 0', () => {
    const amount = amountSrv.calcAmount(0);
    expect(amount).toBe(0);
  })

  it('should return 0', () => {
    const amount = amountSrv.calcAmount(-70);
    expect(amount).toBe(0);
  })
})
