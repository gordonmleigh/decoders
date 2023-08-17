import {
  AnyDecoder,
  Decoder,
  ErrorType,
  OptionsType,
  OutputType,
  decoder,
} from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { error, invalid, ok } from '../core/Result.js';
import { Schema } from '../internal/Schema.js';

/**
 * The error type of an {@link array} decoder.
 *
 * @group Types
 */
export interface ArrayError<ElementDecoder extends AnyDecoder>
  extends DecoderError<'composite:array'> {
  /**
   * Errors for each of the elements, if relevant.
   */
  elements?: { [index: number]: ErrorType<ElementDecoder> | undefined };
}

/**
 * The specific {@link Decoder} type for an {@link array} decoder.
 *
 * @group Types
 */
export type ArrayDecoderType<ElementDecoder extends AnyDecoder> = Decoder<
  OutputType<ElementDecoder>[],
  unknown,
  ArrayError<ElementDecoder>,
  OptionsType<ElementDecoder>
>;

/**
 * An object that can create a {@link array} decoder with a constrained element
 * type.
 *
 * @group Types
 */
export interface ArrayDecoderFactory<ElementType> {
  schema<ElementDecoder extends AnyDecoder<ElementType>>(
    element: ElementDecoder,
  ): ArrayDecoderType<ElementDecoder>;
}

/**
 * Create a {@link Decoder} which can decode an array, using the given
 * decoder for each element.
 *
 * @param element The decoder to use to decode the elements.
 *
 * @example
 * ```typescript
 * const decoder = array(string);
 * ```
 *
 * @group Composite
 */
export function array<ElementDecoder extends AnyDecoder>(
  element: ElementDecoder,
): ArrayDecoderType<ElementDecoder> {
  return decoder((value, opts) => {
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
 * Helper function to allow the output type to be constrained and the other type
 * parameters to be inferred.
 *
 * @remarks
 * This would be used when you want to explicitly specify the element type, but
 * want to benefit from type inference for the rest of the parameters:
 *
 * ```typescript
 * const myType: Decoder<MyType, unknown, MyTypeError, MyTypeOpts> = blah;
 *
 * const decodeList = arrayType<MyType>().schema(myType);
 *
 * // now decodeList has type
 * // Decoder<MyType, unknown, ArrayError<MyTypeError>, MyTypeOpts>
 * ```
 *
 * @group Composite
 */
export function arrayType<ElementType>(): ArrayDecoderFactory<ElementType> {
  return new Schema(array);
}
