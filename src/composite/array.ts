import { Decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { DecoderOptions } from '../core/DecoderOptions.js';
import { error, ok, Result } from '../core/Result.js';

/**
 * The error type of an array decoder.
 */
export interface ArrayError<Element extends DecoderError = DecoderError>
  extends DecoderError<'composite:array'> {
  elements?: { [index: number]: Element };
}

export interface ArrayDecoderFactory<Element> {
  schema<Err extends DecoderError>(
    element: Decoder<Element, unknown, Err>,
  ): ArrayDecoder<Element, Err>;
}

/**
 * Create a [[Decoder]] which can decode an array, using the given [[Decoder]]
 * to decode each element.
 *
 * @param elem The [[Decoder]] to use to decode the elements.
 */
export function array<Element, ElementErr extends DecoderError>(
  element: Decoder<Element, unknown, ElementErr>,
): Decoder<Element[], unknown, ArrayError<ElementErr>> {
  return ArrayDecoder.schema(element);
}

/**
 * Helper function to allow the output type to be constrained and the error type
 * inferred.
 */
export function arrayType<Element>(): ArrayDecoderFactory<Element> {
  return ArrayDecoder as ArrayDecoderFactory<Element>;
}

class ArrayDecoder<Element, ElementErr extends DecoderError>
  implements Decoder<Element[], unknown, ArrayError<ElementErr>>
{
  public static readonly schema = <Element, ElementErr extends DecoderError>(
    element: Decoder<Element, unknown, ElementErr>,
  ): ArrayDecoder<Element, ElementErr> => {
    return new this(element);
  };

  constructor(public readonly element: Decoder<Element, unknown, ElementErr>) {}

  public decode(
    value: unknown,
    opts?: DecoderOptions,
  ): Result<Element[], ArrayError<ElementErr>> {
    if (!Array.isArray(value)) {
      return error({ type: 'composite:array', text: 'expected array' });
    }

    const decoded: Element[] = [];
    const errors: Record<number, ElementErr> = {};
    let anyErrors = false;

    for (let i = 0; i < value.length; ++i) {
      const elemResult = this.element.decode(value[i], opts);
      if (elemResult.ok) {
        decoded[i] = elemResult.value;
      } else {
        errors[i] = elemResult.error;
        anyErrors = true;
      }
    }

    if (anyErrors) {
      return error({
        type: 'composite:array',
        text: 'invalid elements',
        elements: errors,
      });
    }
    return ok(decoded);
  }
}
