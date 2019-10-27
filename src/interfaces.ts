export interface FieldType {
  value: any;
  setValue(value: any): void;
  blurred: boolean;
  blur(): void;
  unblur(): void;
}
