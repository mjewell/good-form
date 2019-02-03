import { isObservableArray, action } from 'mobx';
import invariant from 'invariant';
import createChildArray from '../Children/createArray';

export default (Node, type) =>
  class extends Node {
    children = createChildArray(type);

    @action
    setValue(value) {
      invariant(
        Array.isArray(value) || isObservableArray(value),
        'value must be an array'
      );
      this.children.replace(value);
    }
  };
