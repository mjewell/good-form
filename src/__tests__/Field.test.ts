import { Field } from "../Field";

describe("value", (): void => {
  it("is set in the constructor", (): void => {
    const field = new Field(1);

    expect(field.value).toBe(1);
  });
});

describe("setValue", (): void => {
  it("sets the value", (): void => {
    const field = new Field(1);

    field.setValue(2);

    expect(field.value).toBe(2);
  });
});

describe("blur", (): void => {
  it("is not blurred initially", (): void => {
    const field = new Field(1);

    expect(field.blurred).toBe(false);
  });

  it("can be blurred and unblurred", (): void => {
    const field = new Field(1);

    expect(field.blurred).toBe(false);

    field.blur();

    expect(field.blurred).toBe(true);

    field.unblur();

    expect(field.blurred).toBe(false);
  });
});
