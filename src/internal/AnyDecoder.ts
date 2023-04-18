import { Decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';

export type AnyDecoder = Decoder<any, any, any>;

export type DecoderArray<
  Out = any,
  In = any,
  Err extends DecoderError = any,
> = Decoder<Out, In, Err>[];
