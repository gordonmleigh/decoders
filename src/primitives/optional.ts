import { Decoder } from '../core/Decoder';
import { ok } from '../core/Result';

export function optional<Out, In>(
  decoder: Decoder<Out, In>,
): Decoder<Out | undefined, In> {
  return (value) => (typeof value === 'undefined' ? ok(value) : decoder(value));
}
