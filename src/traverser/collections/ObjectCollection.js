import { action, observable, computed } from 'mobx';

export default class ObjectCollection {
  @observable collection;

  constructor(collection) {
    this.collection = collection;
  }

  map(callback) {
    return Object.entries(this.collection).reduce(
      (obj, [key, value]) => ({
        ...obj,
        [key]: callback(value, key, this.collection)
      }),
      {}
    );
  }

  forEach(callback) {
    this.map(callback);
  }

  filter(callback) {
    return Object.entries(this.collection).reduce((obj, [key, value]) => {
      if (!callback(value, key)) {
        return obj;
      }

      return {
        ...obj,
        [key]: value
      };
    }, {});
  }

  @computed
  get size() {
    return Object.keys(this.collection).length;
  }

  has(key) {
    return key in this.collection;
  }

  get(key) {
    return this.collection[key];
  }

  @action
  set(key, value) {
    this.collection[key] = value;
  }

  @action
  remove(key) {
    delete this.collection[key];
  }

  some(callback) {
    return Object.entries(this.collection).some(([key, value]) =>
      callback(value, key, this.collection)
    );
  }

  every(callback) {
    return Object.entries(this.collection).every(([key, value]) =>
      callback(value, key, this.collection)
    );
  }
}
