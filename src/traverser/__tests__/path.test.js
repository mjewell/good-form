import { types } from 'mobx-state-tree';
import traverser from '..';

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

it('returns the path when it is only one level deep', () => {
  const node = NestedNode.create(value);

  expect(node.getChild(['obj']).path).toStrictEqual(['obj']);
});

it('returns the path when it is multiple levels deep', () => {
  const node = NestedNode.create(value);

  expect(node.getChild(['obj', 'arr']).path).toStrictEqual(['obj', 'arr']);
});

it('returns the path when it includes array indices', () => {
  const node = NestedNode.create(value);

  expect(node.getChild(['obj', 'arr', 0]).path).toStrictEqual([
    'obj',
    'arr',
    0
  ]);
});

it('returns paths that have dots or brackets in them', () => {
  const node = NestedNode.create(value);

  expect(node.getChild(['dotted.path', 'square[brackets]']).path).toStrictEqual(
    ['dotted.path', 'square[brackets]']
  );
});
