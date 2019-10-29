import { FieldType } from "../interfaces";
import { Field } from "../Field";
import { FieldObject, ShapeType } from "../FieldObject";

class StringField extends Field<string> {}
class NumberField extends Field<number> {}

it("can be extended", (): void => {
  type MyFieldType = FieldType & { hasRandomProperty: boolean };

  class MyField<T> extends Field<T> {
    public hasRandomProperty: boolean = true;
  }

  class MyStringField extends MyField<string> {}
  class MyNumberField extends MyField<number> {}

  class MyFieldObject<Shape extends ShapeType<MyFieldType>> extends FieldObject<
    Shape,
    MyFieldType
  > {
    public get hasRandomProperty(): boolean {
      return Object.keys(this.fields).some(
        (f): boolean => this.fields[f].hasRandomProperty
      );
    }
  }

  const F = MyFieldObject.of({
    a: MyStringField,
    b: MyNumberField
  });

  const f = new F({
    a: "a",
    b: 1
  });

  expect(f.fields.a.hasRandomProperty).toBe(true);

  expect(f.hasRandomProperty).toBe(true);
});

describe("complex examples", (): void => {
  it("handles objects", (): void => {
    const Form = FieldObject.of({
      name: StringField,
      age: NumberField
    });

    const form = new Form({
      name: "a",
      age: 1
    });

    expect(form.value).toEqual({
      name: "a",
      age: 1
    });

    form.setValue({
      name: "b",
      age: 2
    });

    expect(form.value).toEqual({
      name: "b",
      age: 2
    });
  });

  it("handles nested objects", (): void => {
    const Form = FieldObject.of({
      user: FieldObject.of({
        name: StringField,
        age: NumberField
      })
    });

    const form = new Form({
      user: {
        name: "a",
        age: 1
      }
    });

    expect(form.value).toEqual({
      user: {
        name: "a",
        age: 1
      }
    });

    form.setValue({
      user: {
        name: "b",
        age: 2
      }
    });

    expect(form.value).toEqual({
      user: {
        name: "b",
        age: 2
      }
    });
  });
});
