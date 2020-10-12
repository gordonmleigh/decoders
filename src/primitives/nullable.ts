import { Decoder } from '../core/Decoder';
import { ok } from '../core/Result';

export function nullable<Out, In>(
  decoder: Decoder<Out, In>,
): Decoder<Out | null, In> {
  return (value) =>
    value === null ? ok((value as unknown) as null) : decoder(value);
}
