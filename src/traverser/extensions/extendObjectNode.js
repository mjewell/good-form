import invariant from 'invariant';
import isPlainObject from 'lodash/isPlainObject';
import { action, observable } from 'mobx';
import ObjectCollection from '../collections/ObjectCollection';

export default (Node, type) => {
  class ObjectNode extends Node {
    @observable children = new ObjectCollection({});

    constructor(value = {}) {
      super(value);

      this.setValue(value);
    }

    @action
    setValue(value) {
      invariant(isPlainObject(value), 'value must be a plain object');

      // we only want to create nodes for when there
      const valuesInType = new ObjectCollection(value).filter(
        (v, k) => k in type
      );

      new ObjectCollection(valuesInType).forEach((v, k) => {
        const child = this.children.get(k);

        if (child) {
          child.setValue(v);
        } else {
          this.children.set(k, new type[k](v));
        }
      });
    }
  }

  // For some reason if you just return this directly then everything is fucked
  // give it a name and return it on a separate line to fix the issue
  // https://github.com/Microsoft/TypeScript/issues/14607
  return ObjectNode;
};
