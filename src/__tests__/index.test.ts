import isEqual from 'lodash.isequal';

import {
  noMiddleware,
  noMiddlewareAsync,
  withMiddlewareCreator,
  withMiddlewareCreatorAsync
} from '../';


type DB = {
  nextExecuted: boolean;
  onErrorExecuted: boolean;
  payload: string;
}

describe('withMiddleware helper functions', () => {
  const imutableData: Readonly<DB> = { nextExecuted: false, onErrorExecuted: false, payload: '' };

  let mutableData = { ...imutableData };
  let mockValidatorResult = true;

  const resetMutableData = (): void => {
    mutableData = { ...imutableData };
    mockValidatorResult = true;
  };

  const expectedPayload = {
    validNext: 'hello from next side effect',
    validNextWithArgs: 'Jane snacks on elephant, it\'s her favorite fruit!',
    validNextAsync: 'hello from async next side effect',
    invalid: 'hello from onError side effect',
  } as const;

  const mockNext = (): void => {
    mutableData.nextExecuted = true;
    mutableData.payload = expectedPayload.validNext;
  };

  const mockNextWithArgs = (name: string, identifiesAs: 'his' | 'her', favoriteFruit: string): void => {
    mutableData.nextExecuted = true;
    mutableData.payload = `${name} snacks on ${favoriteFruit}, it's ${identifiesAs} favorite fruit!`;
  };

  const mockAsyncNext = async (): Promise<void> => {
    mutableData.nextExecuted = true;
    mutableData.payload = expectedPayload.validNextAsync;
  };

  const mockOnError = (): void => {
    mutableData.onErrorExecuted = true;
    mutableData.payload = expectedPayload.invalid;
  };

  beforeEach(resetMutableData);

  it('withMiddlewareCreator synchronous', () => {
    mockValidatorResult = true;

    const expectedValid = { nextExecuted: true, onErrorExecuted: false, payload: expectedPayload.validNext };
    const expectedInvalid = { nextExecuted: false, onErrorExecuted: true, payload: expectedPayload.invalid };

    const interceptWithValid = withMiddlewareCreator(
      () => mockValidatorResult,
      mockOnError
    );
    const customFuncInterceptedWithValid = interceptWithValid(mockNext);

    expect(isEqual(mutableData, imutableData)).toBe(true);

    customFuncInterceptedWithValid();

    expect(isEqual(mutableData, expectedValid)).toBe(true);

    resetMutableData();
    expect(isEqual(mutableData, imutableData)).toBe(true);
    mockValidatorResult = false;

    const interceptWithInvalid = withMiddlewareCreator(
      () => mockValidatorResult,
      mockOnError
    );
    const customFuncInterceptedWithInvalid = interceptWithInvalid(mockNext);

    customFuncInterceptedWithInvalid();
    expect(isEqual(mutableData, expectedInvalid)).toBe(true);
  });

  it('with noMiddleware utility function', () => {
    resetMutableData();
    const expectedValid = { nextExecuted: true, onErrorExecuted: false, payload: expectedPayload.validNext };

    const customFuncInterceptedWithNoMiddleware = noMiddleware(mockNext);
    expect(isEqual(mutableData, imutableData)).toBe(true);

    customFuncInterceptedWithNoMiddleware();
    expect(isEqual(mutableData, expectedValid)).toBe(true);
  });

  it('withMiddlewareCreator synchronous with args', () => {
    mockValidatorResult = true;

    const expectedValid = { nextExecuted: true, onErrorExecuted: false, payload: expectedPayload.validNextWithArgs };
    const expectedInvalid = { nextExecuted: false, onErrorExecuted: true, payload: expectedPayload.invalid };

    const interceptWithValid = withMiddlewareCreator(
      () => mockValidatorResult,
      mockOnError
    );
    const customFuncWithArgsInterceptedWithValid = interceptWithValid(mockNextWithArgs);

    expect(isEqual(mutableData, imutableData)).toBe(true);

    customFuncWithArgsInterceptedWithValid('Jane', 'her', 'elephant');
    expect(isEqual(mutableData, expectedValid)).toBe(true);

    resetMutableData();
    expect(isEqual(mutableData, imutableData)).toBe(true);
    mockValidatorResult = false;

    const interceptWithInvalid = withMiddlewareCreator(
      () => mockValidatorResult,
      mockOnError
    );
    const customFuncWithArgsInterceptedWithInvalid = interceptWithInvalid(mockNextWithArgs);

    customFuncWithArgsInterceptedWithInvalid('Jane', 'her', 'elephant');
    expect(isEqual(mutableData, expectedInvalid)).toBe(true);
  });

  it('withMiddleware asynchronous', async () => {
    mockValidatorResult = true;

    const expectedValid = { nextExecuted: true, onErrorExecuted: false, payload: expectedPayload.validNextAsync };
    const expectedInvalid = { nextExecuted: false, onErrorExecuted: true, payload: expectedPayload.invalid };

    const interceptWithValid = withMiddlewareCreatorAsync(
      () => mockValidatorResult,
      mockOnError
    );
    const customFuncInterceptedWithValid = interceptWithValid(mockAsyncNext);

    expect(isEqual(mutableData, imutableData)).toBe(true);

    await customFuncInterceptedWithValid();

    expect(isEqual(mutableData, expectedValid)).toBe(true);

    resetMutableData();
    expect(isEqual(mutableData, imutableData)).toBe(true);
    mockValidatorResult = false;

    const interceptWithInvalid = withMiddlewareCreatorAsync(
      () => mockValidatorResult,
      mockOnError
    );
    const customFuncInterceptedWithInvalid = interceptWithInvalid(mockAsyncNext);

    await customFuncInterceptedWithInvalid();
    expect(isEqual(mutableData, expectedInvalid)).toBe(true);
  });

  it('with noMiddlewareAsync utility function', async () => {
    resetMutableData();
    const expectedValid = { nextExecuted: true, onErrorExecuted: false, payload: expectedPayload.validNextAsync };

    const customFuncInterceptedWithNoMiddleware = noMiddlewareAsync(mockAsyncNext);
    expect(isEqual(mutableData, imutableData)).toBe(true);

    await customFuncInterceptedWithNoMiddleware();
    expect(isEqual(mutableData, expectedValid)).toBe(true);
  });

});
