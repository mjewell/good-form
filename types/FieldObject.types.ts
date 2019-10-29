import { Field, FieldObject, FieldType, ShapeType } from "../src";

describe("complex examples", () => {
  type MyFieldType = FieldType & { hasRandomProperty: boolean };

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

  it("can be extended", () => {
    class MyField<T> extends Field<T> {
      public hasRandomProperty: boolean = true;
    }

    class MyStringField extends MyField<string> {}

    const Form = MyFieldObject.of({
      a: MyStringField
    });

    const form = new Form({
      a: "a"
    });

    // $ExpectType boolean
    form.fields.a.hasRandomProperty;
    // $ExpectType boolean
    form.hasRandomProperty;
  });

  it("requires properties in FieldType", () => {
    class MyStringField extends Field<string> {}

    // $ExpectError
    const Form = MyFieldObject.of({
      a: MyStringField
    });
  });
});

describe("of", () => {
  class StringField extends Field<string> {}
  class NumberField extends Field<number> {}

  describe("one level", () => {
    const Form = FieldObject.of({
      name: StringField,
      age: NumberField
    });

    const form = new Form({
      name: "Joe",
      age: 25
    });

    describe("constructor", () => {
      it("enforces that all keys are present", () => {
        // $ExpectError
        new Form({
          name: "Joe"
        });
      });

      it("enforces that all keys are the correct type", () => {
        new Form({
          name: "Joe",
          age: "25" // $ExpectError
        });
      });
    });

    describe("value", () => {
      it("has the right types", () => {
        // $ExpectType string
        form.value.name;
        // $ExpectType number
        form.value.age;
      });

      it("enforces that all keys are present", () => {
        // $ExpectError
        form.setValue({
          name: "Joe"
        });
      });

      it("enforces that all keys are the correct type", () => {
        form.setValue({
          name: "Joe",
          age: "25" // $ExpectError
        });
      });
    });
  });

  describe("nested", () => {
    const Form = FieldObject.of({
      name: FieldObject.of({
        first: StringField,
        last: StringField
      }),
      age: NumberField
    });

    const form = new Form({
      name: {
        first: "Joe",
        last: "Smith"
      },
      age: 25
    });

    describe("constructor", () => {
      it("enforces that all keys are present", () => {
        // $ExpectError
        new Form({
          name: {
            first: "Joe",
            last: "Smith"
          }
        });
      });

      it("enforces that all nested keys are present", () => {
        new Form({
          // $ExpectError
          name: {
            first: "Joe"
          },
          age: 25
        });
      });

      it("enforces that all keys are the correct type", () => {
        new Form({
          name: {
            first: "Joe",
            last: "Smith"
          },
          age: "25" // $ExpectError
        });
      });

      it("enforces that all nested keys are the correct type", () => {
        new Form({
          name: {
            first: "Joe",
            last: 25 // $ExpectError
          },
          age: 25
        });
      });
    });

    describe("value", () => {
      it("has the right types", () => {
        // $ExpectType string
        form.value.name.first;
        // $ExpectType string
        form.value.name.last;
        // $ExpectType number
        form.value.age;
      });

      it("enforces that all keys are present", () => {
        // $ExpectError
        form.setValue({
          name: {
            first: "Joe",
            last: "Smith"
          }
        });
      });

      it("enforces that all nested keys are present", () => {
        form.setValue({
          // $ExpectError
          name: {
            first: "Joe"
          },
          age: 25
        });
      });

      it("enforces that all keys are the correct type", () => {
        form.setValue({
          name: {
            first: "Joe",
            last: "Smith"
          },
          age: "25" // $ExpectError
        });
      });

      it("enforces that all nested keys are the correct type", () => {
        form.setValue({
          name: {
            first: "Joe",
            last: 25 // $ExpectError
          },
          age: 25
        });
      });
    });
  });

  describe("subclass", () => {
    class UserField extends FieldObject.of({
      name: StringField,
      age: NumberField
    }) {
      public doSomething() {
        return this.value;
      }
    }

    const form = new UserField({
      name: "Joe",
      age: 25
    });

    describe("constructor", () => {
      it("enforces that all keys are present", () => {
        // $ExpectError
        new UserField({
          name: "Joe"
        });
      });

      it("enforces that all keys are the correct type", () => {
        new UserField({
          name: "Joe",
          age: "25" // $ExpectError
        });
      });
    });

    describe("value", () => {
      it("has the right types", () => {
        // $ExpectType string
        form.value.name;
        // $ExpectType number
        form.value.age;
      });

      it("enforces that all keys are present", () => {
        // $ExpectError
        form.setValue({
          name: "Mary"
        });
      });

      it("enforces that all keys are the correct type", () => {
        form.setValue({
          name: "Mary",
          age: "25" // $ExpectError
        });
      });
    });

    it("has the methods defined", () => {
      form.doSomething();
    });
  });
});
