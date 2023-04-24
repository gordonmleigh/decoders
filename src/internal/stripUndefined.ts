type UndefinedProperties<T> = {
  [P in keyof T]-?: undefined extends T[P] ? P : never;
}[keyof T];

type OptionalUndefined<T> = Partial<Pick<T, UndefinedProperties<T>>> &
  Pick<T, Exclude<keyof T, UndefinedProperties<T>>>;

export function stripUndefined<T>(value: T): OptionalUndefined<T> {
  const ret = {} as T;

  for (const k in value) {
    if (value[k] !== undefined) {
      ret[k] = value[k];
    }
  }

  return ret;
}
