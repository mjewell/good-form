import { types } from 'mobx-state-tree';
import traverser from '..';

it('recurses through deep objects', () => {
  const NumberNode = traverser.createLeafNode(types.number);
  const NumberMapNode = traverser.createObjectNode(NumberNode);
  const NumberMapArrayNode = traverser.createArrayNode(NumberMapNode);
  const obj = traverser
    .createObjectNode({
      arr: NumberMapArrayNode
    })
    .create({
      arr: [
        {
          a: 1
        }
      ]
    });

  expect(obj.value).toEqual({
    arr: [{ a: 1 }]
  });
  expect(obj.getChild('arr').value).toEqual([{ a: 1 }]);
  expect(obj.getChild('arr[0]').value).toEqual({ a: 1 });
  expect(obj.getChild('arr[0].a').value).toBe(1);
});

it('can be extended', () => {
  let t = traverser.extendLeafNode(node =>
    node
      .props({
        blurred: false
      })
      .actions(self => ({
        blur() {
          self.blurred = true;
        },
        unblur() {
          self.blurred = false;
        }
      }))
  );

  t = t.extendParentNode(node =>
    node
      .views(self => ({
        get blurred() {
          return self.children.some(child => child.blurred);
        }
      }))
      .actions(self => ({
        blur() {
          self.children.map(child => child.blur());
        },
        unblur() {
          self.children.map(child => child.unblur());
        }
      }))
  );

  const FormNode = t.createObjectNode({
    name: t.createObjectNode({
      first: t.createLeafNode(types.string),
      last: t.createLeafNode(types.string)
    })
  });

  const form = FormNode.create({
    name: {
      first: '',
      last: ''
    }
  });

  expect(form.blurred).toBe(false);
  expect(form.getChild('name.first').blurred).toBe(false);

  form.blur();

  expect(form.blurred).toBe(true);
  expect(form.getChild('name.first').blurred).toBe(true);
});
