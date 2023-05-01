import { DecoderError } from '../core/DecoderError.js';
import {
  DecoderValidator,
  DecoderValidatorBase,
} from '../core/DecoderValidator.js';
import { Result, invalid, ok } from '../core/Result.js';

export interface StringLengthOptions {
  minLength?: number;
  maxLength?: number;
}

export type StringDecoderError = DecoderError<
  'value:string' | 'value:string-max-length' | 'value:string-min-length'
> &
  StringLengthOptions;

type StringDecoderExtra = {
  length(maxLength: number): StringDecoderType;
  length(maxLength: number | undefined, minLength?: number): StringDecoderType;
  length(options: StringLengthOptions): StringDecoderType;
  maxLength(length: number): StringDecoderType;
  minLength(length: number): StringDecoderType;
  trim(): StringDecoderType;
};

export type StringDecoderType = DecoderValidator<
  string,
  unknown,
  StringDecoderError
> &
  StringDecoderExtra;

type StringDecoderOptions = StringLengthOptions & {
  trim?: boolean;
};

class StringDecoder
  extends DecoderValidatorBase<string, unknown, StringDecoderError>
  implements StringDecoderType
{
  public readonly options: StringDecoderOptions;

  constructor(opts: StringDecoderOptions = {}) {
    super();
    this.options = { ...opts };
  }

  public decode(value: unknown): Result<string, StringDecoderError> {
    if (typeof value !== 'string') {
      return invalid('value:string', 'expected a string');
    }
    const output = this.options.trim ? value.trim() : value;

    if (this.options.maxLength && output.length > this.options.maxLength) {
      return invalid(
        'value:string-max-length',
        `expected up to ${this.options.maxLength} characters`,
        {
          maxLength: this.options.maxLength,
        },
      );
    }
    if (this.options.minLength && output.length < this.options.minLength) {
      return invalid(
        'value:string-min-length',
        `expected at least ${this.options.minLength} characters`,
        {
          minLength: this.options.minLength,
        },
      );
    }
    return ok(output);
  }

  public length(maxLength: number): StringDecoderType;
  public length(
    maxLength: number | undefined,
    minLength: number | undefined,
  ): StringDecoderType;
  public length(options: StringLengthOptions): StringDecoderType;
  public length(
    maxOrOpts: number | undefined | StringLengthOptions,
    minLength?: number,
  ): StringDecoderType {
    if (typeof maxOrOpts === 'number') {
      this.options.maxLength = maxOrOpts;
    } else if (maxOrOpts !== undefined) {
      if (maxOrOpts.maxLength !== undefined) {
        this.options.maxLength = maxOrOpts.maxLength;
      }
      if (maxOrOpts.minLength !== undefined) {
        this.options.minLength = maxOrOpts.minLength;
      }
    }
    if (minLength !== undefined) {
      this.options.minLength = minLength;
    }
    return this;
  }

  public maxLength(length: number): StringDecoderType {
    this.options.maxLength = length;
    return this;
  }

  public minLength(length: number): StringDecoderType {
    this.options.minLength = length;
    return this;
  }

  public trim(): StringDecoderType {
    this.options.trim = true;
    return this;
  }
}

/**
 * A decoder which can accept a string value.
 */
export const string: StringDecoderType = new StringDecoder();
