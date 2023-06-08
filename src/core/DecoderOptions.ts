/**
 * Specifies the action to take when a field is encountered that has no
 * corresponding decoder.
 */
export enum ExtraFields {
  /**
   * Silently drop the field.
   */
  Ignore,

  /**
   * Include the field and its value verbatim.
   */
  Include,

  /**
   * Return a error result.
   */
  Reject,
}

/**
 * Specifies the action to take for an when a decoder for a field returns
 * undefined.
 */
export enum UndefinedFields {
  /**
   * Keep if present in input.
   */
  FromInput,

  /**
   * Set undefined explicitly even if not present in input.
   */
  Explicit,

  /**
   * Remove undefined fields.
   */
  Strip,
}

/**
 * Options to control decoding of a value.
 */
export interface DecoderOptions {
  /**
   * Specifies the action to take when a field is encountered that has no
   * corresponding decoder.
   */
  extraFields?: ExtraFields;

  /**
   * Specifies the action to take for an when a decoder for a field returns
   * undefined.
   */
  undefinedFields?: UndefinedFields;
}

/**
 * The default values of [[DecoderOptions]] that will be used if no value is
 * specified.
 */
export const DefaultDecoderOptions: Required<DecoderOptions> = {
  extraFields: ExtraFields.Ignore,
  undefinedFields: UndefinedFields.Strip,
};

/**
 * Combine multiple instances of [[DecoderOptions]].
 */
export function combineDecoderOptions(
  ...opts: DecoderOptions[]
): DecoderOptions;
export function combineDecoderOptions(
  ...opts: (DecoderOptions | undefined)[]
): DecoderOptions | undefined;
export function combineDecoderOptions(
  ...opts: (DecoderOptions | undefined)[]
): DecoderOptions | undefined {
  return opts.reduce((a, x) => combineTwoOptions(a, x), {});
}

/**
 * @hidden
 */
function combineTwoOptions(
  a: DecoderOptions | undefined,
  b: DecoderOptions | undefined,
): DecoderOptions | undefined {
  if (
    b === undefined ||
    (b.extraFields === undefined && b.undefinedFields === undefined)
  ) {
    return a;
  }
  if (
    a === undefined ||
    (a.extraFields === undefined && a.undefinedFields === undefined)
  ) {
    return b;
  }
  if (b.extraFields !== undefined && b.undefinedFields !== undefined) {
    return b;
  }
  return {
    extraFields: b.extraFields === undefined ? a.extraFields : b.extraFields,
    undefinedFields:
      b.undefinedFields === undefined ? a.undefinedFields : b.undefinedFields,
  };
}
