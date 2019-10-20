import { Field } from "../Field";
import { FormObject, FormObjectValues, ShapeType } from "../FormObject";

class StringField extends Field<string> {}
class NumberField extends Field<number> {}

it("does stuff", (): void => {
  class X<T extends ShapeType> extends FormObject<T> {
    public get x(): FormObjectValues<T> {
      return this.value;
    }
  }

  class Y<T extends ShapeType> extends X<T> {
    public get y(): FormObjectValues<T> {
      return this.value;
    }
  }

  const F = Y.of({
    first: StringField
  });

  const f = new F({
    first: "1"
  });

  console.log(f);
  console.log(f.x);
  console.log(f.y);
});

describe("complex examples", (): void => {
  it("handles objects", (): void => {
    const Form = FormObject.of({
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
    const UserForm = FormObject.of({
      name: StringField,
      age: NumberField
    });

    const userForm = new UserForm({
      name: "",
      age: "1"
    });

    const Form = FormObject.of({
      user: UserForm
    });

    const form = new Form({
      user: {
        name: "a",
        age: "1" // this should fail
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
