export type TypePredicate<Out extends In, In = unknown> = (
  value: In,
) => value is Out;
