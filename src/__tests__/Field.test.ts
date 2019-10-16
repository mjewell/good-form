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
