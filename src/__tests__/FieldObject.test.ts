import { FieldObject } from "../FieldObject";
import { Field } from "../Field";

class StringField extends Field<string> {}

class NameForm extends FieldObject.of({
  firstName: StringField,
  lastName: StringField
}) {}

describe("value", (): void => {
  it("is set in the constructor", (): void => {
    const form = new FieldObject(
      {
        firstName: Field,
        lastName: Field
      },
      {
        firstName: "a",
        lastName: 1
      }
    );

    expect(form.value).toEqual({
      firstName: "a",
      lastName: 1
    });
  });
});

describe("setValue", (): void => {
  it("sets the value of each field", (): void => {
    const form = new NameForm({
      firstName: "a",
      lastName: "b"
    });

    form.setValue({
      firstName: "c",
      lastName: "d"
    });

    expect(form.value).toEqual({
      firstName: "c",
      lastName: "d"
    });
  });

  it("sets the value of each field", (): void => {
    const form = new NameForm({
      firstName: "a",
      lastName: "b"
    });

    form.setValue({
      firstName: "c",
      lastName: "d"
    });

    expect(form.value).toEqual({
      firstName: "c",
      lastName: "d"
    });
  });
});

describe("blur", (): void => {
  it("is not blurred initially", (): void => {
    const form = new NameForm({
      firstName: "a",
      lastName: "b"
    });

    expect(form.blurred).toBe(false);
  });

  it("is blurred if any field is blurred", (): void => {
    const form = new NameForm({
      firstName: "a",
      lastName: "b"
    });

    form.fields.firstName.blur();
    expect(form.blurred).toBe(true);

    form.fields.lastName.blur();
    expect(form.blurred).toBe(true);

    form.fields.firstName.unblur();
    expect(form.blurred).toBe(true);

    form.fields.lastName.unblur();
    expect(form.blurred).toBe(false);
  });

  it("blurs and unblurs all of its fields", (): void => {
    const form = new NameForm({
      firstName: "a",
      lastName: "b"
    });

    form.blur();
    expect(form.fields.firstName.blurred).toBe(true);
    expect(form.fields.lastName.blurred).toBe(true);

    form.unblur();
    expect(form.fields.firstName.blurred).toBe(false);
    expect(form.fields.lastName.blurred).toBe(false);
  });
});
