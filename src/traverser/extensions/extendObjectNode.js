import { isModelType } from 'mobx-state-tree';
import invariant from 'invariant';
import isPlainObject from 'lodash/isPlainObject';
import isNode from '../utils/isNode';
import createChildObject from '../Children/createObject';
import createChildMap from '../Children/createMap';

export default (node, type) => node
    .props({
      children: isModelType(type)
        ? createChildObject(type)
        : createChildMap(type)
    })
    .actions(self => ({
      setValue(value) {
        invariant(isPlainObject(value), 'value must be an object');

        const childrenToRemove = self.children.filter(
          (child, key) => !(key in value)
        );

        Object.keys(childrenToRemove).forEach(key => {
          self.removeChild(key);
        });

        const entries = Object.entries(value);

        const nodeEntries = entries.filter(([key, child]) => isNode(child));

        nodeEntries.forEach(([key, child]) => {
          self.addChild(key, child);
        });

        const nonNodeEntries = entries.filter(([key, child]) => !isNode(child));

        const newNonNodeEntries = nonNodeEntries.filter(
          ([key]) => !self.children.has(key)
        );

        const existingNonNodeEntries = nonNodeEntries.filter(([key]) =>
          self.children.has(key)
        );

        newNonNodeEntries.forEach(([key, child]) => {
          self.addChild(key, child);
        });

        existingNonNodeEntries.forEach(([key, child]) => {
          const existingChild = self.children.get(key);
          existingChild.setValue(child);
        });
      }
    }));
