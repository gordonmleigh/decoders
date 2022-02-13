import 'jest';
import { mockDecoder, mockFailDecoder } from '../internal/mockDecoder.js';
import { typeGuard } from './typeGuard.js';

describe('typeGuard', () => {
  it('creates an TypeGuard that returns true on success', () => {
    const decoder = mockDecoder();
    const guard = typeGuard(decoder);

    const input = Symbol();
    const result = guard(input);

    expect(result).toBe(true);
    expect(decoder).toHaveBeenCalledTimes(1);
    expect(decoder.mock.calls[0][0]).toBe(input);
  });

  it('creates an TypeGuard which returns false on failure', () => {
    const decoder = mockFailDecoder();
    const guard = typeGuard(decoder);

    const input = Symbol();
    const result = guard(input);

    expect(result).toBe(false);
    expect(decoder).toHaveBeenCalledTimes(1);
    expect(decoder.mock.calls[0][0]).toBe(input);
  });
});
