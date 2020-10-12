import { DecoderError } from './Result';

export class ModelDecodingError extends Error {
  public static readonly Name = 'ModelDecodingError';

  constructor(public readonly errors: DecoderError[]) {
    super(`decoding failed`);
    this.name = ModelDecodingError.Name;
  }
}
