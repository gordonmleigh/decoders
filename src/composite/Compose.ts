import { Decoder } from '../core/Decoder';

/**
 * Represents a function which can compose multiple decoders together to create
 * a single decoder. Type-safe up to 8-arity.
 */
export interface Compose {
  /**
   * Compose multiple decoders together to create a single decoder.
   */
  <T1, T2>(d1: Decoder<T2, T1>): Decoder<T2, T1>;
  /**
   * Compose multiple decoders together to create a single decoder.
   */
  <T1, T2, T3>(d1: Decoder<T2, T1>, d2: Decoder<T3, T2>): Decoder<T3, T1>;
  /**
   * Compose multiple decoders together to create a single decoder.
   */
  <T1, T2, T3, T4>(
    d1: Decoder<T2, T1>,
    d2: Decoder<T3, T2>,
    d3: Decoder<T4, T3>,
  ): Decoder<T4, T1>;
  /**
   * Compose multiple decoders together to create a single decoder.
   */
  <T1, T2, T3, T4, T5>(
    d1: Decoder<T2, T1>,
    d2: Decoder<T3, T2>,
    d3: Decoder<T4, T3>,
    d4: Decoder<T5, T4>,
  ): Decoder<T5, T1>;
  /**
   * Compose multiple decoders together to create a single decoder.
   */
  <T1, T2, T3, T4, T5, T6>(
    d1: Decoder<T2, T1>,
    d2: Decoder<T3, T2>,
    d3: Decoder<T4, T3>,
    d4: Decoder<T5, T4>,
    d5: Decoder<T6, T5>,
  ): Decoder<T5, T1>;
  /**
   * Compose multiple decoders together to create a single decoder.
   */
  <T1, T2, T3, T4, T5, T6, T7>(
    d1: Decoder<T2, T1>,
    d2: Decoder<T3, T2>,
    d3: Decoder<T4, T3>,
    d4: Decoder<T5, T4>,
    d5: Decoder<T6, T5>,
    d6: Decoder<T7, T6>,
  ): Decoder<T5, T1>;
  /**
   * Compose multiple decoders together to create a single decoder.
   */
  <T1, T2, T3, T4, T5, T6, T7, T8>(
    d1: Decoder<T2, T1>,
    d2: Decoder<T3, T2>,
    d3: Decoder<T4, T3>,
    d4: Decoder<T5, T4>,
    d5: Decoder<T6, T5>,
    d6: Decoder<T7, T6>,
    d7: Decoder<T8, T7>,
  ): Decoder<T5, T1>;
  /**
   * Compose multiple decoders together to create a single decoder.
   */
  <T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    d1: Decoder<T2, T1>,
    d2: Decoder<T3, T2>,
    d3: Decoder<T4, T3>,
    d4: Decoder<T5, T4>,
    d5: Decoder<T6, T5>,
    d6: Decoder<T7, T6>,
    d7: Decoder<T8, T7>,
    d8: Decoder<T9, T8>,
  ): Decoder<T5, T1>;
  /**
   * Compose multiple decoders together to create a single decoder.
   */
  <T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    d1: Decoder<T2, T1>,
    d2: Decoder<T3, T2>,
    d3: Decoder<T4, T3>,
    d4: Decoder<T5, T4>,
    d5: Decoder<T6, T5>,
    d6: Decoder<T7, T6>,
    d7: Decoder<T8, T7>,
    d8: Decoder<T9, T8>,
    ...rest: Decoder<T9, T9>[]
  ): Decoder<T5, T1>;
}
