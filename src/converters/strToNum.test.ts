import 'jest';
import { assertCond } from '../internal/assertCond.js';
import { strToNum } from './strToNum.js';

describe('strToNum', () => {
  it('it convers a string to a number', () => {
    const result = strToNum.decode('42');

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(42);
  });

  it('it convers a string with decimal places to a number', () => {
    const result = strToNum.decode('42.23');

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual(42.23);
  });

  it('it rejects a non-numeric string', () => {
    const result = strToNum.decode('42 grams');

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error.type).toEqual('value:number');
  });

  it('it rejects a number', () => {
    const result = strToNum.decode(5);

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error.type).toEqual('value:string');
  });
});
