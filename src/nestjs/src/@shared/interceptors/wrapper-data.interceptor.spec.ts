import { lastValueFrom, of } from 'rxjs';
import { WrapperDataInterceptor } from './wrapper-data.interceptor';

describe('WrapperDataInterceptor Unit Tests', () => {
  let interceptor: WrapperDataInterceptor;

  beforeEach(() => {
    interceptor = new WrapperDataInterceptor();
  });

  it('should wrapper with data key', async () => {
    const interceptor = new WrapperDataInterceptor();
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of({ name: 'test' }),
    });

    expect(await lastValueFrom(obs$)).toStrictEqual({
      data: { name: 'test' },
    });
  });

  it('should not wrapper when meta key is present', async () => {
    expect(interceptor).toBeDefined();
    const result = { data: [{ name: 'test' }], meta: { total: 1 } };
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of(result),
    });

    expect(await lastValueFrom(obs$)).toStrictEqual({ ...result });
  });
});
