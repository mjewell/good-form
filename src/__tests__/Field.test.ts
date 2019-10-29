import { Field } from "../Field";

describe("subclassing", (): void => {
  it("can add methods", (): void => {
    class StringField extends Field<string> {
      public sayHello(): string {
        return `Hello ${this.value}`;
      }
    }

    const stringField = new StringField("Joe");

    expect(stringField.sayHello()).toBe("Hello Joe");
  });

  it("can override methods", (): void => {
    class StringField extends Field<string> {
      public setValue(value: string): void {
        this.value = `Hello ${value}`;
      }
    }

    const stringField = new StringField("");

    stringField.setValue("Joe");
    expect(stringField.value).toBe("Hello Joe");
  });

  it("can override the constructor", (): void => {
    class StringField extends Field<string> {
      public constructor(value: string) {
        super(`Hello ${value}`);
      }
    }

    const stringField = new StringField("Joe");

    expect(stringField.value).toBe("Hello Joe");
  });
});

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
