export interface FieldType {
  value: unknown;
  setValue(value: unknown): void;
  blurred: boolean;
  blur(): void;
  unblur(): void;
}
