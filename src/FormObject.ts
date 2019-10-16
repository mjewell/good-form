import { Form } from "./Form";

export type FormObjectFields<Shape> = {
  [K in keyof Shape]: Shape[K];
};

export type FormObjectValues<Shape> = {
  [K in keyof Shape]: Shape[K] extends {
    new (value: infer T): Form<infer T>;
  }
    ? T
    : never;
};

export class FormObject<Shape> {
  public fields: FormObjectFields<Shape>;

  public constructor(shape: Shape, value: FormObjectValues<Shape>) {
    this.fields = Object.entries(shape).reduce<FormObjectFields<Shape>>(
      (hash, [key, Type]): any => ({
        ...hash,
        [key]: new Type((value as any)[key])
      }),
      {} as any
    );
  }

  public get value(): FormObjectValues<Shape> {
    return Object.entries(this.fields).reduce<any>(
      (hash, [key, field]) => ({
        ...hash,
        [key]: field.value
      }),
      {}
    );
  }

  public setValue(value: FormObjectValues<Shape>): void {}
}
