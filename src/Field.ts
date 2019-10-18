import { Form } from "./Form";

export class Field<T> implements Form {
  public value: T;

  public constructor(value: T) {
    this.value = value;
  }

  public setValue(value: T): void {
    this.value = value;
  }
}
