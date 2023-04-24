import 'jest';
import { assertCond } from '../internal/assertCond.js';
import { mockDecoder, mockFailDecoder } from '../internal/mockDecoder.js';
import { ExtraFields, UndefinedFields, object } from './object.js';

describe('composite:object', () => {
  it('invokes each property decoder', () => {
    const value1 = Symbol();
    const value2 = Symbol();
    const value3 = Symbol();

    const prop1 = mockDecoder<typeof value1, { str: string }>(value1);
    const prop2 = mockDecoder<typeof value2, { num: number }>(value2);
    const prop3 = mockDecoder(value3);

    const decoder = object({
      prop1,
      prop2,
      prop3,
    });

    const input = {
      prop1: Symbol(),
      prop2: Symbol(),
      prop3: Symbol(),
    };
    const result = decoder.decode(input, {
      num: 1,
      str: 'hello',
    });

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual({
      prop1: value1,
      prop2: value2,
      prop3: value3,
    });

    expect(prop1.decode).toHaveBeenCalledTimes(1);
    expect(prop1.mock.calls[0][0]).toBe(input.prop1);
    expect(prop1.mock.calls[0][1]).toEqual({ num: 1, str: 'hello' });

    expect(prop2.decode).toHaveBeenCalledTimes(1);
    expect(prop2.mock.calls[0][0]).toBe(input.prop2);
    expect(prop1.mock.calls[0][1]).toEqual({ num: 1, str: 'hello' });

    expect(prop3.decode).toHaveBeenCalledTimes(1);
    expect(prop3.mock.calls[0][0]).toBe(input.prop3);
  });

  it('invokes property decoder if property not present on input', () => {
    const value1 = Symbol();

    const prop1 = mockDecoder(value1);

    const decoder = object({
      prop1,
    });

    const input = {};
    const result = decoder.decode(input);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual({
      prop1: value1,
    });

    expect(prop1.decode).toHaveBeenCalledTimes(1);
    expect(prop1.mock.calls[0][0]).toBeUndefined();
  });

  it('rejects non-objects', () => {
    const value1 = Symbol();

    const prop1 = mockDecoder(value1);

    const decoder = object({
      prop1,
    });

    const result = decoder.decode(1);

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error.type).toBe('composite:object');

    expect(prop1.decode).toHaveBeenCalledTimes(0);
  });

  it('rejects dates', () => {
    const value1 = Symbol();

    const prop1 = mockDecoder(value1);

    const decoder = object({
      prop1,
    });

    const result = decoder.decode(new Date());

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error.type).toBe('composite:object');

    expect(prop1.decode).toHaveBeenCalledTimes(0);
  });

  it('rejects functions', () => {
    const value1 = Symbol();

    const prop1 = mockDecoder(value1);

    const decoder = object({
      prop1,
    });

    const result = decoder.decode(() => {});

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error.type).toBe('composite:object');

    expect(prop1.decode).toHaveBeenCalledTimes(0);
  });

  it('rejects class instances', () => {
    const value1 = Symbol();

    const prop1 = mockDecoder(value1);

    const decoder = object({
      prop1,
    });

    const result = decoder.decode(new (class {})());

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error.type).toBe('composite:object');

    expect(prop1.decode).toHaveBeenCalledTimes(0);
  });

  it('ignores properties with no matching decoder', () => {
    const value1 = Symbol();

    const prop1 = mockDecoder(value1);

    const decoder = object({
      prop1,
    });

    const input = {
      prop1: Symbol(),
      prop2: Symbol(),
    };
    const result = decoder.decode(input);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual({
      prop1: value1,
    });

    expect(prop1.decode).toHaveBeenCalledTimes(1);
    expect(prop1.mock.calls[0][0]).toBe(input.prop1);
  });

  it('rejects properties with no matching decoder if extraFields is set to Reject', () => {
    const value1 = Symbol();

    const prop1 = mockDecoder(value1);

    const decoder = object({
      prop1,
    });

    const input = {
      prop1: Symbol(),
      prop2: Symbol(),
    };
    const result = decoder.decode(input, { extraFields: ExtraFields.Reject });

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error).toEqual({
      type: 'composite:object',
      text: 'invalid properties',
      properties: {
        prop2: {
          type: 'value:invalid',
          text: 'unexpected property',
        },
      },
    });

    expect(prop1.decode).toHaveBeenCalledTimes(1);
    expect(prop1.mock.calls[0][0]).toBe(input.prop1);
  });

  it('sets missing properties to be explicitly undefined', () => {
    const prop1 = mockDecoder(undefined);

    const decoder = object(
      {
        prop1,
      },
      { undefinedFields: UndefinedFields.Explicit },
    );

    const input = {};
    const result = decoder.decode(input);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(Object.keys(result.value)).toEqual(['prop1']);
    expect(result.value.prop1).toBeUndefined();

    expect(prop1.decode).toHaveBeenCalledTimes(1);
    expect(prop1.mock.calls[0][0]).toBeUndefined();
  });

  it('removes missing properties if UndefinedFields is set to Strip in decoder call', () => {
    const prop1 = mockDecoder(undefined);

    const decoder = object({
      prop1,
    });

    const input = {};
    const result = decoder.decode(input, {
      undefinedFields: UndefinedFields.Strip,
    });

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(Object.keys(result.value)).toEqual([]);

    expect(prop1.decode).toHaveBeenCalledTimes(1);
    expect(prop1.mock.calls[0][0]).toBeUndefined();
  });

  it('removes missing properties if UndefinedFields is set to Strip in decoder creation', () => {
    const prop1 = mockDecoder(undefined);

    const decoder = object(
      {
        prop1,
      },
      { undefinedFields: UndefinedFields.Strip },
    );

    const input = {};
    const result = decoder.decode(input);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(Object.keys(result.value)).toEqual([]);

    expect(prop1.decode).toHaveBeenCalledTimes(1);
    expect(prop1.mock.calls[0][0]).toBeUndefined();
  });

  it('chooses decoder call properties over decoder creation properties', () => {
    const prop1 = mockDecoder(undefined);

    const decoder = object(
      {
        prop1,
      },
      { undefinedFields: UndefinedFields.Explicit },
    );

    const input = {};
    const result = decoder.decode(input, {
      undefinedFields: UndefinedFields.Strip,
    });

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(Object.keys(result.value)).toEqual([]);

    expect(prop1.decode).toHaveBeenCalledTimes(1);
    expect(prop1.mock.calls[0][0]).toBeUndefined();
  });

  it('rejects if a property decoder rejects', () => {
    const value1 = Symbol();

    const prop1 = mockDecoder(value1);
    const prop2 = mockFailDecoder(2);
    const prop3 = mockFailDecoder(3);

    const decoder = object({
      prop1,
      prop2,
      prop3,
    });

    const input = {
      prop1: Symbol(),
      prop2: Symbol(),
      prop3: Symbol(),
    };
    const result = decoder.decode(input);

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error).toEqual({
      type: 'composite:object',
      text: 'invalid properties',
      properties: {
        prop2: { type: 'FAIL2', text: 'text2' },
        prop3: { type: 'FAIL3', text: 'text3' },
      },
    });

    expect(prop1.decode).toHaveBeenCalledTimes(1);
    expect(prop1.mock.calls[0][0]).toBe(input.prop1);

    expect(prop2.decode).toHaveBeenCalledTimes(1);
    expect(prop2.mock.calls[0][0]).toBe(input.prop2);

    expect(prop3.decode).toHaveBeenCalledTimes(1);
    expect(prop3.mock.calls[0][0]).toBe(input.prop3);
  });
});
