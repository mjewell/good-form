import invariant from 'invariant';
import isPlainObject from 'lodash/isPlainObject';
import { action, intercept, observable } from 'mobx';
import isNode from '../utils/isNode';
import ObjectCollection from '../collections/ObjectCollection';
import createChildMap from '../Children/createMap';

export default (Node, type) => {
  class ObjectNode extends Node {
    @observable children = new ObjectCollection({});

    constructor(value = {}) {
      super(value);

      invariant(
        isPlainObject(value),
        'ObjectNode value must be a plain object'
      );

      intercept(this.children.collection, change => {
        type[change.name](change.newValue);
        return change;
      });

      this.setValue(value);

      // the intercept will monitor all changes but not initialization
      // validate all the keys once after setting them
      Object.keys(type).forEach(key => {
        type[key](this.children.get(key));
      });
    }

    @action
    setValue(value) {
      invariant(isPlainObject(value), 'value must be an object');

      const valuesInType = new ObjectCollection(value).filter(
        (v, k) => k in type
      );

      new ObjectCollection(valuesInType).forEach((v, k) => {
        const currentChild = this.children.get(k);

        if (currentChild && !isNode(v)) {
          currentChild.setValue(v);
          return;
        }

        if (isNode(v)) {
          this.children.set(k, v);
          return;
        }

        this.children.set(k, type[k].create(v));
      });
    }
  }

  // For some reason if you just return this directly then everything is fucked
  // give it a name and return it on a separate line to fix the issue
  // https://github.com/Microsoft/TypeScript/issues/14607
  return ObjectNode;
};
