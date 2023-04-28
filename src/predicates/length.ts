import { Decoder, decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { Result, error, ok } from '../core/Result.js';

export interface Lengthy {
  length: number;
}

export interface LengthOptions {
  min?: number;
  max?: number;
}

export type LengthDecoderError = DecoderError<'value:length'> & LengthOptions;

export function length<Out extends Lengthy>(
  length: number,
): Decoder<Out, Out, LengthDecoderError>;
export function length<Out extends Lengthy>(
  options: LengthOptions,
): Decoder<Out, Out, LengthDecoderError>;
export function length<Out extends Lengthy>(
  length: number | LengthOptions,
): Decoder<Out, Out, LengthDecoderError> {
  const max = typeof length === 'number' ? length : length.max;
  const min = typeof length === 'number' ? length : length.min;

  return decoder<Out, Out, LengthDecoderError>(
    (value): Result<Out, LengthDecoderError> => {
      const valid =
        (max === undefined || value.length <= max) &&
        (min === undefined || value.length >= min);

      if (valid) {
        return ok(value);
      }
      return error({
        type: 'value:length',
        text: makeText({ max, min }),
        max,
        min,
      });
    },
  );
}

function makeText(bounds: LengthOptions): string {
  if (bounds.min !== undefined) {
    if (bounds.max === bounds.min) {
      return `expected length to be ${bounds.min}`;
    }
    if (bounds.max !== undefined) {
      return `expected length between ${bounds.min} and ${bounds.max}`;
    }
    return `expected length of at least ${bounds.min}`;
  }
  if (bounds.max !== undefined) {
    return `expected length to be no more than ${bounds.max}`;
  }
  return `unexpected length`;
}
