import { types } from 'mobx-state-tree';

export default Type =>
  types
    .model('ChildrenMap', {
      collection: Type
    })
    .views(self => ({
      forEach(callback) {
        self.map(callback);
      },
      map(callback) {
        return Array.from(self.collection.entries()).reduce(
          (obj, [key, value]) => ({
            ...obj,
            [key]: callback(value, key)
          }),
          {}
        );
      },
      filter(callback) {
        return Array.from(self.collection.entries()).reduce(
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
        return self.collection.size;
      },
      has(key) {
        return self.collection.has(key);
      },
      get(key) {
        return self.collection.get(key);
      },
      some(callback) {
        return Array.from(self.collection.values()).some(callback);
      },
      every(callback) {
        return Array.from(self.collection.values()).every(callback);
      }
    }))
    .actions(self => ({
      set(key, value) {
        self.collection.set(key, value);
      },
      remove(key) {
        return self.collection.delete(key);
      },
      replace(collection) {
        self.collection.replace(collection);
      }
    }));
