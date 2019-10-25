export function map<Shape extends object, T>(
  obj: Shape,
  callback: <K extends keyof Shape>(value: Shape[K], key: K, obj: Shape) => T
): { [P in keyof Shape]: T } {
  const result: Partial<{ [P in keyof Shape]: T }> = {};

  Object.entries(obj).forEach(([key, value]): void => {
    const k = key as keyof Shape;
    result[k] = callback(value, k, obj);
  });

  return result as { [P in keyof Shape]: T };
}

export function forEach<Shape extends object>(
  obj: Shape,
  callback: <K extends keyof Shape>(value: Shape[K], key: K, obj: Shape) => void
): void {
  map(obj, callback);
}

export function filter<Shape extends object>(
  obj: Shape,
  callback: <K extends keyof Shape>(
    value: Shape[K],
    key: K,
    obj: Shape
  ) => boolean
): Partial<Shape> {
  const result: Partial<Shape> = {};

  Object.entries(obj)
    .filter(([key, value]): boolean => callback(value, key as keyof Shape, obj))
    .forEach(([key, value]): void => {
      const k = key as keyof Shape;
      result[k] = value;
    });

  return result;
}

export function some<Shape extends object>(
  obj: Shape,
  callback: <K extends keyof Shape>(
    value: Shape[K],
    key: K,
    obj: Shape
  ) => boolean
): boolean {
  return Object.entries(obj).some(([key, value]): boolean =>
    callback(value, key as keyof Shape, obj)
  );
}
