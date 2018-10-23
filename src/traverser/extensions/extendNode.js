import { getParent } from 'mobx-state-tree';

export default node =>
  node
    .props({
      isTraverserNode: true
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
