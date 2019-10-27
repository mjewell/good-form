import { Field } from "../src";

it("enforces the type of the value", () => {
  class StringField extends Field<string> {}

  const field = new StringField("a");

  // $ExpectType string
  field.value;

  // $ExpectError
  field.setValue(1);
});

it("correctly infers the type", () => {
  const field = new Field("a");

  // $ExpectType string
  field.value;

  // $ExpectError
  field.setValue(1);
});
