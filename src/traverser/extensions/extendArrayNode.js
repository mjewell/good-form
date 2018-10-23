import { isObservableArray } from 'mobx';
import invariant from 'invariant';
import createChildArray from '../Children/createArray';

export default (node, type) =>
  node
    .props({
      children: createChildArray(type)
    })
    .actions(self => ({
      setValue(value) {
        invariant(
          Array.isArray(value) || isObservableArray(value),
          'value must be an array'
        );
        self.children.replace(value);
      }
    }));
