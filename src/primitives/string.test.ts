import 'jest';
import { expectInvalid, expectValid } from '../internal/expectResult.js';
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

  it('trims if trim is set', () => {
    const result = string.trim().decode('  \nhello world\t \n');
    expectValid(result, 'hello world');
  });

  it('requires minimum length if set', () => {
    const decoder = string.min(4);

    expectInvalid(decoder.decode('123'), 'value:string');
    expectValid(decoder.decode('1234'), '1234');
    expectValid(decoder.decode('12345'), '12345');
  });

  it('requires maximum length if set', () => {
    const decoder = string.max(4);

    expectValid(decoder.decode('123'), '123');
    expectValid(decoder.decode('1234'), '1234');
    expectInvalid(decoder.decode('12345'), 'value:string');
  });
});
