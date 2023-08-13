import 'jest';
import {
  expectInvalid,
  expectValid,
} from '../internal/testing/expectResult.js';
import { string } from './string.js';

describe('date', () => {
  it('decodes a string', () => {
    const result = string.decode('hello world');
    expectValid(result, 'hello world');
  });

  it('rejects numbers', () => {
    const result = string.decode(0);
    expectInvalid(result, 'value:string');
  });
});
