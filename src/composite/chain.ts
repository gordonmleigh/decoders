import { Decoder } from '../core/Decoder';
import { ok, Result } from '../core/Result';
import { Compose } from './Compose';

/**
 * Represents a function which can compose multiple decoders together to create
 * a single decoder. Types are not checked.
 */
export interface UntypedCompose {
  /**
   * Compose multiple decoders together to create a single decoder.
   */
  (decoders: Decoder<unknown, any>[]): Decoder<unknown>;
}

/**
 * Represents a function which can compose multiple decoders together to create
 * a single decoder. Type-safe up to 8-arity.
 *
 * Includes a convenience property `all` to compose unknown types together.
 */
export interface Chain extends Compose {
  /**
   * Compose multiple decoders together to create a single decoder. Types are
   * not checked.
   */
  all: UntypedCompose;
}

/**
 * Compose multiple decoders together to create a single decoder. Type-safe up
 * to 8-arity.
 */
export const chain: Chain = Object.assign(variadicChain, { all: chainAll });

/**
 * @hidden
 */
function chainAll(decoders: Decoder<unknown, any>[]): Decoder<unknown> {
  if (decoders.length === 0) {
    throw new Error(`there must be at least one Decoder in a chain`);
  }
  if (decoders.length === 1) {
    return decoders[0];
  }
  return (value) => {
    let result: Result<unknown> = ok(value);

    for (const decoder of decoders) {
      if (!result.ok) {
        return result;
      }
      result = decoder(result.value);
    }

    return result;
  };
}

/**
 * @hidden
 */
function variadicChain(
  ...decoders: Decoder<unknown, unknown>[]
): Decoder<unknown, unknown> {
  return chainAll(decoders);
}
