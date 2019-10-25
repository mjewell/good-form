import { action, observable } from "mobx";
import { FieldType } from "./interfaces";

export class Field<T> implements FieldType {
  @observable public value: T;

  @observable public blurred: boolean = false;

  public constructor(value: T) {
    this.value = value;
  }

  @action
  public setValue(value: T): void {
    this.value = value;
  }

  @action
  public blur(): void {
    this.blurred = true;
  }

  @action
  public unblur(): void {
    this.blurred = false;
  }
}
