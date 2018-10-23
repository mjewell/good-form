import { typecheck } from 'mobx-state-tree';

export default (node, type) =>
  node
    .props({
      value: type
    })
    .actions(self => ({
      setValue(value) {
        self.value = value;
      }
    }))
    .preProcessSnapshot(snapshot => {
      try {
        typecheck(node, snapshot);
        return snapshot;
      } catch (e) {
        return { value: snapshot };
      }
    });
