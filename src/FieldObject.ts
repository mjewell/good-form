import { action, computed, observable } from "mobx";
import { FieldType } from "./interfaces";
import { some, map, forEach } from "./collections/object";

export interface ShapeType<F extends FieldType = FieldType> {
  [key: string]: { new (value: any): F };
}

export type FieldObjectFields<
  Shape extends ShapeType<F>,
  F extends FieldType = FieldType
> = {
  [K in keyof Shape]: InstanceType<Shape[K]>;
};

export type FieldObjectValues<
  Shape extends ShapeType<F>,
  F extends FieldType = FieldType
> = {
  [K in keyof Shape]: InstanceType<Shape[K]>["value"];
};

export class FieldObject<
  Shape extends ShapeType<F>,
  F extends FieldType = FieldType
> implements FieldType {
  public static of<
    T extends {
      new (shape: Shape, value: FieldObjectValues<Shape, F>): FieldObject<
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
    new (value: FieldObjectValues<Shape, F>): FieldObject<Shape, F> &
      InstanceType<T>;
  } {
    const SuperClass = this as new (...args: any[]) => FieldObject<Shape, F>;
    return class DefinedFieldObject extends SuperClass {
      public constructor(value: FieldObjectValues<Shape, F>) {
        super(shape, value);
      }
    } as {
      new (value: FieldObjectValues<Shape, F>): FieldObject<Shape, F> &
        InstanceType<T>;
    };
  }

  private shape: Shape;

  @observable public fields: FieldObjectFields<Shape>;

  public constructor(shape: Shape, value: FieldObjectValues<Shape, F>) {
    this.shape = shape;
    this.fields = ({} as any) as FieldObjectFields<Shape, F>;
    this.setValue(value);
  }

  @computed
  public get value(): FieldObjectValues<Shape, F> {
    return map(
      this.fields,
      (field): any => (field as FieldType).value
    ) as FieldObjectValues<Shape, F>;
  }

  @action
  public setValue(value: FieldObjectValues<Shape, F>): void {
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

  @computed
  public get blurred(): boolean {
    return some(this.fields, (field): boolean => field.blurred);
  }

  @action
  public blur(): void {
    forEach(this.fields, (field): void => field.blur());
  }

  @action
  public unblur(): void {
    forEach(this.fields, (field): void => field.unblur());
  }
}
