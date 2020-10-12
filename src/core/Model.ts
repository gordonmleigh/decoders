import { extendFunction } from '../util/extendFunction';
import { Decoder } from './Decoder';
import { ModelDecodingError } from './ModelDecodingError';

export interface Model<T> extends Decoder<T> {
  assert(value: unknown): T;
  test(value: unknown): value is T;
}

export function model<T>(decoder: Decoder<T>): Model<T> {
  return extendFunction(decoder, {
    assert: (value: unknown) => {
      const result = decoder(value);
      if (!result.ok) {
        throw new ModelDecodingError(result.error);
      }
      return result.value;
    },

    test: (value: unknown): value is T => decoder(value).ok,
  });
}
