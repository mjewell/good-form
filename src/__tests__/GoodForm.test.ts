import { GoodForm } from "../GoodForm";

describe("complex examples", (): void => {
  class StringField extends GoodForm.Field<string> {}
  class NumberField extends GoodForm.Field<number> {}

  it("handles objects", (): void => {
    const Form = GoodForm.Object({
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
  });

  it("handles nested objects", (): void => {
    const Form = GoodForm.Object({
      user: GoodForm.Object({
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
  });
});
