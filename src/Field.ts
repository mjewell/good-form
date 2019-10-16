import { Form } from "./Form";

export class Field<T> implements Form<T> {
  public value: T;

  public constructor(value: T) {
    this.value = value;
  }

  public setValue(value: T): void {
    this.value = value;
  }
}
