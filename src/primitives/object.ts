import { Decoder } from '../core/Decoder';
import { DecoderError, error, invalid, ok, Result } from '../core/Result';

export const ExpectedObject = 'EXPECTED_OBJECT';
export const UnexpectedField = 'UNEXPECTED_FIELD';

export type PropDecoders<T> = { [K in keyof T]: Decoder<T[K]> };

export enum ExtraFields {
  Ignore,
  Include,
  Reject,
}

export interface ObjectDecoderOptions {
  extraFields?: ExtraFields;
}

export interface ObjectDecoderFactory {
  <T>(props: PropDecoders<T>): Decoder<T>;
}

export interface ObjectDecoder extends ObjectDecoderFactory {
  options(opts: ObjectDecoderOptions): ObjectDecoderFactory;
  partial: ObjectDecoderFactory;
  strict: ObjectDecoderFactory;
}

export const object: ObjectDecoder = Object.assign(objectOptions(), {
  options: objectOptions,
  partial: objectOptions({ extraFields: ExtraFields.Include }),
  strict: objectOptions({ extraFields: ExtraFields.Reject }),
});

function objectOptions({
  extraFields = ExtraFields.Ignore,
}: ObjectDecoderOptions = {}): ObjectDecoderFactory {
  return <T>(props: PropDecoders<T>) => (value: unknown): Result<T> => {
    if (typeof value !== 'object' || value === null) {
      return invalid(ExpectedObject, 'expected object');
    }

    let anyErrors = false;
    const errors: DecoderError[] = [];
    const allKeys = Object.keys(Object.assign({}, value, props));
    const outputValue: Record<string, unknown> = {};

    for (const key of allKeys) {
      if (key in props) {
        // property is in validator definition
        const decoder = props[key as keyof T];

        const propResult = decoder((value as Record<string, unknown>)[key]);

        if (!propResult.ok) {
          anyErrors = true;
          errors.push(
            ...propResult.error.map((x) => ({
              ...x,
              field: joinIds(key, x.field),
            })),
          );
        } else {
          outputValue[key] = propResult.value;
        }
      } else {
        // property is not in validator definition
        switch (extraFields) {
          case ExtraFields.Reject:
            anyErrors = true;
            errors.push({
              id: UnexpectedField,
              text: 'unexpected value',
              field: key,
            });
            break;

          case ExtraFields.Ignore:
            break;

          case ExtraFields.Include:
            outputValue[key] = (value as Record<string, unknown>)[key];
            break;
        }
      }
    }

    if (anyErrors || errors.length) {
      return error(errors);
    } else {
      return ok(outputValue as T);
    }
  };
}

function joinIds(...ids: (string | undefined)[]): string {
  return ids.filter(Boolean).join('.');
}
