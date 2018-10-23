import invariant from 'invariant';
import toPath from 'lodash/toPath';

export default node =>
  node
    .views(self => ({
      get value() {
        return self.children.map(child => child.value);
      },
      getChild(path) {
        const pathArray = toPath(path);

        const [nextPath, ...remainingPath] = pathArray;

        const child = self.children.get(nextPath);

        invariant(child, `No child found in path at '${nextPath}'`);

        if (remainingPath.length === 0) {
          return child;
        }

        return child.getChild(remainingPath);
      },
      get pathLookup() {
        const map = {};
        self.children.forEach((value, key) => {
          map[value.id] = key;
        });
        return map;
      },
      pathTo(childNode) {
        const path = self.pathLookup[childNode.id];

        invariant(path, 'Child node must exist in parent');

        return path;
      }
    }))
    .actions(self => ({
      addChild(key, value) {
        self.children.set(key, value);
      },
      removeChild(key) {
        invariant(self.children.has(key), `No child exists with name '${key}'`);

        self.children.remove(key);
      }
    }))
    .preProcessSnapshot(snapshot => ({
      children: {
        collection: snapshot
      }
    }));
