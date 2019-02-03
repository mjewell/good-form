import { intercept, observable, action } from 'mobx';
import invariant from 'invariant';
import typeCheck from '../types/validate';

function validateType(type) {
  invariant(
    typeof type === 'function' && typeof type.is === 'function',
    'LeafNode type must be a tcomb object'
  );
}

export default (Node, type) => {
  validateType(type);

  class LeafNode extends Node {
    @observable value;

    constructor(value) {
      super(value);

      intercept(this, 'value', change => {
        typeCheck(type, change.newValue);
        return change;
      });

      this.setValue(value);
    }

    @action.bound
    setValue(value) {
      this.value = value;
    }
  }

  // For some reason if you just return this directly then everything is fucked
  // give it a name and return it on a separate line to fix the issue
  // https://github.com/Microsoft/TypeScript/issues/14607
  return LeafNode;
};
