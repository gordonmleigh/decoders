import {
  AnyDecoder,
  Decoder,
  ErrorType,
  OptionsType,
  OutputType,
} from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { Result, error, invalid, ok } from '../core/Result.js';

/**
 * The error type of an array decoder.
 */
export interface ArrayError<ElementDecoder extends AnyDecoder>
  extends DecoderError<'composite:array'> {
  elements?: { [index: number]: ErrorType<ElementDecoder> };
}

export type ArrayDecoderType<ElementDecoder extends AnyDecoder> = Decoder<
  OutputType<ElementDecoder>[],
  unknown,
  ArrayError<ElementDecoder>,
  OptionsType<ElementDecoder>
>;

export interface ArrayDecoderFactory<ElementType> {
  schema<ElementDecoder extends Decoder<ElementType>>(
    element: ElementDecoder,
  ): ArrayDecoderType<ElementDecoder>;
}

/**
 * Create a [[Decoder]] which can decode an array, using the given [[Decoder]]
 * to decode each element.
 *
 * @param elem The [[Decoder]] to use to decode the elements.
 */
export function array<ElementDecoder extends AnyDecoder>(
  element: ElementDecoder,
): ArrayDecoderType<ElementDecoder> {
  return ArrayDecoder.schema(element);
}

/**
 * Helper function to allow the output type to be constrained and the error type
 * inferred.
 */
export function arrayType<ElementType>(): ArrayDecoderFactory<ElementType> {
  return ArrayDecoder;
}

class ArrayDecoder<ElementDecoder extends AnyDecoder>
  implements ArrayDecoderType<ElementDecoder>
{
  public static readonly schema = <ElementDecoder extends AnyDecoder>(
    element: ElementDecoder,
  ): ArrayDecoderType<ElementDecoder> => {
    return new this(element);
  };

  constructor(public readonly element: ElementDecoder) {}

  public decode(
    value: unknown,
    opts?: OptionsType<ElementDecoder>,
  ): Result<OutputType<ElementDecoder>[], ArrayError<ElementDecoder>> {
    if (!Array.isArray(value)) {
      return invalid('composite:array', 'expected array');
    }

    const decoded: OutputType<ElementDecoder>[] = [];
    const errors: Record<number, ErrorType<ElementDecoder>> = {};
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
