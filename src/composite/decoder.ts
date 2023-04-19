import { Decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';

/**
 * Represents a function that can decode a value.
 */
export type DecoderFunction<
  Out,
  In = unknown,
  Err extends DecoderError = DecoderError,
> = Decoder<Out, In, Err>['decode'];

/**
 * Create a custom decoder from a {@link DecoderFunction}.
 */
export function decoder<Out, In, Err extends DecoderError>(
  decode: DecoderFunction<Out, In, Err>,
): Decoder<Out, In, Err> {
  return new SimpleDecoder(decode);
}

class SimpleDecoder<Out, In, Err extends DecoderError>
  implements Decoder<Out, In, Err>
{
  constructor(public readonly decode: DecoderFunction<Out, In, Err>) {}
}
