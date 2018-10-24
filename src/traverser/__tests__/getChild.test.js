import { types } from 'mobx-state-tree';
import traverser from '..';

describe('getChild', () => {
  const value = {
    obj: {
      arr: [
        {
          nestedObj: {
            val: 1
          },
          val: 2
        }
      ]
    },
    'dotted.path': {
      'square[brackets]': 1
    }
  };

  const NestedNode = traverser.createObjectNode({
    obj: traverser.createObjectNode({
      arr: traverser.createArrayNode(
        traverser.createObjectNode({
          nestedObj: traverser.createObjectNode({
            val: traverser.createLeafNode(types.number)
          }),
          val: traverser.createLeafNode(types.number)
        })
      )
    }),
    'dotted.path': traverser.createObjectNode({
      'square[brackets]': traverser.createLeafNode(types.number)
    })
  });

  describe('string paths', () => {
    it('returns the node at the path when it is only one level deep', () => {
      const node = NestedNode.create(value);

      expect(node.getChild('obj').value).toStrictEqual(value.obj);
    });

    it('returns the node at the path when it is multiple levels deep', () => {
      const node = NestedNode.create(value);

      expect(node.getChild('obj.arr').value).toStrictEqual(value.obj.arr);
    });

    it('returns the node at the path when it includes array indices', () => {
      const node = NestedNode.create(value);

      expect(node.getChild('obj.arr[0]').value).toStrictEqual(value.obj.arr[0]);
    });

    it('cannot access nodes whose paths have dots in them', () => {
      const node = NestedNode.create(value);

      expect(() => node.getChild('dotted.path.square[brackets]')).toThrow(
        "No child found in path at 'dotted'"
      );
    });

    it('cannot access nodes whose paths have square brackets in them', () => {
      const node = NestedNode.create(value);
      const childNode = node.getChild(['dotted.path']);

      expect(() => childNode.getChild('square[brackets]')).toThrow(
        "No child found in path at 'square'"
      );
    });

    it('errors when the path does not exist', () => {
      const node = NestedNode.create(value);

      expect(() => node.getChild('obj.asdf')).toThrow(
        "No child found in path at 'asdf'"
      );
    });
  });

  describe('array paths', () => {
    it('returns the node at the path when it is only one level deep', () => {
      const node = NestedNode.create(value);

      expect(node.getChild(['obj']).value).toStrictEqual(value.obj);
    });

    it('returns the node at the path when it is multiple levels deep', () => {
      const node = NestedNode.create(value);

      expect(node.getChild(['obj', 'arr']).value).toStrictEqual(value.obj.arr);
    });

    it('returns the node at the path when it includes array indices', () => {
      const node = NestedNode.create(value);

      expect(node.getChild(['obj', 'arr', 0]).value).toStrictEqual(
        value.obj.arr[0]
      );
    });

    it('accesses nodes whose paths have dots or brackets in them', () => {
      const node = NestedNode.create(value);

      expect(
        node.getChild(['dotted.path', 'square[brackets]']).value
      ).toStrictEqual(value['dotted.path']['square[brackets]']);
    });

    it('errors when the path does not exist', () => {
      const node = NestedNode.create(value);

      expect(() => node.getChild(['obj', 'asdf'])).toThrow(
        "No child found in path at 'asdf'"
      );
    });
  });
});
