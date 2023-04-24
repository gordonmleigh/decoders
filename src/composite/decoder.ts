import { Decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';

/**
 * Represents a function that can decode a value.
 */
export type DecoderFunction<
  Out,
  In = unknown,
  Err extends DecoderError = DecoderError,
  Opts = unknown,
> = Decoder<Out, In, Err, Opts>['decode'];

/**
 * Create a custom decoder from a {@link DecoderFunction}.
 */
export function decoder<
  Out,
  In = unknown,
  Err extends DecoderError = DecoderError,
  Opts = unknown,
>(decode: DecoderFunction<Out, In, Err, Opts>): Decoder<Out, In, Err, Opts> {
  return new SimpleDecoder(decode);
}

class SimpleDecoder<Out, In, Err extends DecoderError, Opts>
  implements Decoder<Out, In, Err, Opts>
{
  constructor(public readonly decode: DecoderFunction<Out, In, Err, Opts>) {}
}
