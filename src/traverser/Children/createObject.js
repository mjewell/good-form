import { getPropertyMembers, types } from 'mobx-state-tree';

export default Type =>
  types
    .model('ChildrenObject', {
      collection: Type
    })
    .views(self => {
      function presentChildren() {
        return Object.entries(self.collection).reduce((obj, [key, value]) => {
          if (value === undefined) {
            return obj;
          }

          return {
            ...obj,
            [key]: value
          };
        }, {});
      }

      return {
        forEach(callback) {
          self.map(callback);
        },
        map(callback) {
          return Object.entries(presentChildren()).reduce(
            (obj, [key, value]) => ({
              ...obj,
              [key]: callback(value, key)
            }),
            {}
          );
        },
        filter(callback) {
          return Object.entries(presentChildren()).reduce(
            (obj, [key, value]) => {
              if (!callback(value, key)) {
                return obj;
              }

              return {
                ...obj,
                [key]: value
              };
            },
            {}
          );
        },
        get size() {
          return Object.keys(presentChildren()).length;
        },
        has(key) {
          return key in presentChildren();
        },
        get(key) {
          return self.collection[key];
        },
        some(callback) {
          return Object.values(presentChildren()).some(callback);
        },
        every(callback) {
          return Object.values(presentChildren()).every(callback);
        }
      };
    })
    .actions(self => ({
      set(key, value) {
        if (key in getPropertyMembers(Type).properties) {
          self.collection[key] = value;
        }
      },
      remove(key) {
        const child = self.get(key);
        self.collection[key] = undefined;
        return child;
      },
      replace(collection) {
        self.collection = collection;
      }
    }));
