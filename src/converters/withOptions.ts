import { decoder } from '../composite/decoder.js';
import { Decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { Result } from '../core/Result.js';
import { stripUndefined } from '../internal/stripUndefined.js';

export function withOptions<
  Out,
  In = unknown,
  Err extends DecoderError = DecoderError,
  Opts = unknown,
>(
  wrappedDecoder: Decoder<Out, In, Err, Opts>,
  defaultOptions: Opts,
): Decoder<Out, In, Err, Opts> {
  return decoder(
    (value: In, opts: Opts): Result<Out, Err> =>
      wrappedDecoder.decode(value, {
        ...defaultOptions,
        ...stripUndefined(opts),
      }),
  );
}
