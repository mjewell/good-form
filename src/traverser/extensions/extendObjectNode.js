import { isModelType, detach } from 'mobx-state-tree';
import invariant from 'invariant';
import isPlainObject from 'lodash/isPlainObject';
import isNode from '../utils/isNode';
import createChildObject from '../Children/createObject';
import createChildMap from '../Children/createMap';

export default (node, type) =>
  node
    .props({
      children: isModelType(type)
        ? createChildObject(type)
        : createChildMap(type)
    })
    .actions(self => ({
      setValue(value) {
        invariant(isPlainObject(value), 'value must be an object');

        const entriesForNodesThatStillExist = Object.entries(value).filter(
          ([key, val]) => isNode(val)
        );

        const childrenToDetach = self.children.filter((child, key) => {
          const index = entriesForNodesThatStillExist.findIndex(
            presentNode => presentNode[1] === child
          );

          if (index === -1) {
            return false;
          }

          // just the ones that still exist and have moved to a new key
          return entriesForNodesThatStillExist[index][0] !== key;
        });

        Object.values(childrenToDetach).forEach(child => detach(child));

        self.children.replace(value);
      }
    }));
