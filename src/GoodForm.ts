import { Field } from "./Field";
import { FormObject, FormObjectValues } from "./FormObject";

export class GoodForm {
  public static Field = Field;

  public static FormObject = FormObject;

  public static Object<Shape>(
    shape: Shape
  ): {
    new (value: FormObjectValues<Shape>): FormObject<Shape>;
  } {
    return class DefinedFormObject extends FormObject<Shape> {
      public constructor(value: FormObjectValues<Shape>) {
        super(shape, value);
      }
    };
  }
}
