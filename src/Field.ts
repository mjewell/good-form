import { FieldType } from "./interfaces";

export class Field<T> implements FieldType {
  public value: T;

  public constructor(value: T) {
    this.value = value;
  }

  public setValue(value: T): void {
    this.value = value;
  }
}
