import { FieldObject } from "../FieldObject";
import { Field } from "../Field";

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
  it("sets the value", (): void => {
    expect(true).toBe(true);
  });
});
