import { FieldType } from "./interfaces";
import { map, forEach } from "./collections/object";

export interface ShapeType<F extends FieldType = FieldType> {
  [key: string]: { new (value: unknown): F };
}

export type FormObjectFields<
  Shape extends ShapeType<F>,
  F extends FieldType = FieldType
> = {
  [K in keyof Shape]: InstanceType<Shape[K]>;
};

export type FormObjectValues<
  Shape extends ShapeType<F>,
  F extends FieldType = FieldType
> = {
  [K in keyof Shape]: InstanceType<Shape[K]>["value"];
};

export class FormObject<
  Shape extends ShapeType<F>,
  F extends FieldType = FieldType
> implements FieldType {
  public static of<
    T extends {
      new (shape: Shape, value: FormObjectValues<Shape, F>): FormObject<
        Shape,
        F
      >;
    },
    Shape extends ShapeType<F>,
    F extends FieldType = FieldType
  >(
    this: T,
    shape: Shape
  ): {
    new (value: FormObjectValues<Shape, F>): FormObject<Shape, F> &
      InstanceType<T>;
  } {
    const SuperClass = this as new (...args: any[]) => FormObject<Shape, F>;
    return class DefinedFormObject extends SuperClass {
      public constructor(value: FormObjectValues<Shape, F>) {
        super(shape, value);
      }
    } as {
      new (value: FormObjectValues<Shape, F>): FormObject<Shape, F> &
        InstanceType<T>;
    };
  }

  private shape: Shape;

  public fields: FormObjectFields<Shape>;

  public constructor(shape: Shape, value: FormObjectValues<Shape, F>) {
    this.shape = shape;
    this.fields = ({} as any) as FormObjectFields<Shape, F>;
    this.setValue(value);
  }

  public get value(): FormObjectValues<Shape, F> {
    return map(
      this.fields,
      (field): unknown => (field as FieldType).value
    ) as FormObjectValues<Shape, F>;
  }

  public setValue(value: FormObjectValues<Shape, F>): void {
    forEach(this.shape, (Type, key): void => {
      if (key in value) {
        const field = this.fields[key];
        const newValue = value[key];

        if (field) {
          field.setValue(newValue);
        } else {
          const newField = new Type(newValue);
          this.fields[key] = newField as InstanceType<typeof Type>;
        }
      } else {
        const field = this.fields[key];

        if (field) {
          delete this.fields[key];
        }
      }
    });
  }
}
