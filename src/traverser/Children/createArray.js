import { detach, types } from 'mobx-state-tree';

export default Type =>
  types
    .model('ChildrenArray', {
      collection: Type
    })
    .views(self => ({
      replace(collection) {
        this.collection.replace(collection);
      },
      forEach(callback) {
        return self.collection.forEach(callback);
      },
      map(callback) {
        return self.collection.map(callback);
      },
      filter(callback) {
        return self.collection.filter(callback);
      },
      get size() {
        return self.collection.length;
      },
      has(index) {
        return index >= 0 && index < self.size;
      },
      get(index) {
        return self.collection[index];
      },
      some(callback) {
        return self.collection.some(callback);
      },
      every(callback) {
        return self.collection.every(callback);
      }
    }))
    .actions(self => ({
      set(index, value) {
        self.collection[index] = value;
      },
      remove(index) {
        detach(self.get(index));
        return self.collection.splice(index, 1);
      }
    }));
