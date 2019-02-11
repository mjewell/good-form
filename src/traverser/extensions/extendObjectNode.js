import invariant from 'invariant';
import isPlainObject from 'lodash/isPlainObject';
import { action, intercept, observable } from 'mobx';
import t, { getTypeName } from 'tcomb';
import ObjectCollection from '../collections/ObjectCollection';
import createChildMap from '../Children/createMap';

export default (Node, type) => {
  class ObjectNode extends Node {
    @observable children = new ObjectCollection({});

    constructor(value = {}) {
      super(value);

      // need to batch these errors together
      intercept(this.children.collection, change => {
        const subType = type[change.name];
        const newNode = subType.create(change.newValue);
        change.newValue = newNode;
        return change;
      });

      // catch this and add the other errors in
      this.setValue(value);

      // intercept will get all keys that are defined at the start
      // so check all the values that werent provided at the start
      const typeErrors = Object.keys(type)
        .filter(key => !(key in value))
        .reduce((errors, key) => {
          const subType = type[key];

          if (subType.is(undefined)) {
            return errors;
          }

          return [
            ...errors,
            `Invalid value ${t.stringify(undefined)} supplied to ${getTypeName(
              subType
            )}`
          ];
        }, []);

      t.assert(typeErrors.length === 0, typeErrors.join('\n'));
    }

    @action
    setValue(value) {
      invariant(isPlainObject(value), 'value must be a plain object');

      // we only want to create nodes for when there
      const valuesInType = new ObjectCollection(value).filter(
        (v, k) => k in type
      );

      new ObjectCollection(valuesInType).forEach((v, k) => {
        this.children.set(k, v);
      });
    }
  }

  // For some reason if you just return this directly then everything is fucked
  // give it a name and return it on a separate line to fix the issue
  // https://github.com/Microsoft/TypeScript/issues/14607
  return ObjectNode;
};
