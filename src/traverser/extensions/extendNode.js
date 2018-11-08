import { getParent, types } from 'mobx-state-tree';
import uniqid from 'uniqid';

export default node =>
  node
    .props({
      isTraverserNode: true,
      id: types.optional(types.string, () => uniqid())
    })
    .views(self => ({
      get parent() {
        try {
          return getParent(self, 3);
        } catch (e) {
          return null;
        }
      },
      get root() {
        if (!self.parent) {
          return self;
        }

        return self.parent.root;
      },
      get key() {
        return self.parent.pathTo(self);
      },
      get path() {
        if (!self.parent) {
          return [];
        }

        return [...self.parent.path, self.key];
      }
    }));
