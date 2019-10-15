import { observable, action } from 'mobx';

export default Node => {
  class LeafNode extends Node {
    @observable value;

    constructor(value) {
      super(value);

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
