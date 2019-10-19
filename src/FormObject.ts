import { FieldType } from "./interfaces";
import { map, forEach } from "./collections/object";

export interface ShapeType {
  [key: string]: { new (value: unknown): FieldType };
}

export type FormObjectFields<Shape extends ShapeType> = {
  [K in keyof Shape]?: InstanceType<Shape[K]>;
};

export type FormObjectValues<Shape extends ShapeType> = {
  [K in keyof Shape]?: InstanceType<Shape[K]>["value"];
};

export class FormObject<Shape extends ShapeType> {
  private shape: Shape;

  public fields!: FormObjectFields<Shape>;

  public constructor(shape: Shape, value: FormObjectValues<Shape>) {
    this.shape = shape;
    this.fields = {};
    this.setValue(value);
  }

  public get value(): FormObjectValues<Shape> {
    return map(
      this.fields,
      (field): unknown => (field as FieldType).value
    ) as FormObjectValues<Shape>;
  }

  public setValue(value: FormObjectValues<Shape>): void {
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
