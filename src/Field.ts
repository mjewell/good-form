import { action, observable } from "mobx";
import { FieldType } from "./interfaces";

export class Field<T> implements FieldType {
  @observable public value: T;

  public constructor(value: T) {
    this.value = value;
  }

  @action
  public setValue(value: T): void {
    this.value = value;
  }
}
