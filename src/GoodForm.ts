import { Field } from "./Field";
import { FormObject, FormObjectValues, ShapeType } from "./FormObject";

export class GoodForm {
  public static Field = Field;

  public static FormObject = FormObject;

  public static Object<Shape extends ShapeType>(
    shape: Shape
  ): {
    new (value: FormObjectValues<Shape>): FormObject<Shape>;
  } {
    return class DefinedFormObject extends this.FormObject<Shape> {
      public constructor(value: FormObjectValues<Shape>) {
        super(shape, value);
      }
    };
  }
}
