export function extendFunction<F extends Function, P>(fn: F, props: P): F & P {
  return Object.assign(wrapFunction(fn), props);
}

function wrapFunction<F extends Function>(fn: F): F {
  return (function (this: unknown, ...args: unknown[]) {
    return fn.apply(this, args);
  } as unknown) as F;
}
