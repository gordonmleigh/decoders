import { Decoder } from '../core/Decoder.js';

export class Schema<
  Factory extends (...args: any[]) => Decoder<any, any, any, any>,
> {
  constructor(public readonly schema: Factory) {}
}
