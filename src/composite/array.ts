import {
  AnyDecoder,
  ErrorType,
  OptionsType,
  OutputType,
} from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { DecoderValidator, validator } from '../core/DecoderValidator.js';
import { error, invalid, ok } from '../core/Result.js';
import { Schema } from '../internal/Schema.js';

/**
 * The error type of an array decoder.
 */
export interface ArrayError<ElementDecoder extends AnyDecoder>
  extends DecoderError<'composite:array'> {
  elements?: { [index: number]: ErrorType<ElementDecoder> };
}

export type ArrayDecoderType<ElementDecoder extends AnyDecoder> =
  DecoderValidator<
    OutputType<ElementDecoder>[],
    unknown,
    ArrayError<ElementDecoder>,
    OptionsType<ElementDecoder>
  >;

export interface ArrayDecoderFactory<ElementType> {
  schema<ElementDecoder extends AnyDecoder<ElementType>>(
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
  return validator((value, opts) => {
    if (!Array.isArray(value)) {
      return invalid('composite:array', 'expected array');
    }

    const decoded: OutputType<ElementDecoder>[] = [];
    const errors: Record<number, ErrorType<ElementDecoder>> = {};
    let anyErrors = false;

    for (let i = 0; i < value.length; ++i) {
      const elemResult = element.decode(value[i], opts);
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
  });
}

/**
 * Helper function to allow the output type to be constrained and the error type
 * inferred.
 */
export function arrayType<ElementType>(): ArrayDecoderFactory<ElementType> {
  return new Schema(array);
}
