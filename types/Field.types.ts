import { Field } from "../src/Field";

it("enforces the type of the value", () => {
  class StringField extends Field<string> {}

  const field = new StringField("a");

  // $ExpectType string
  field.value;

  // $ExpectError
  field.setValue(1);
});
