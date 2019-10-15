import traverser from '..';
import { action, observable, computed } from 'mobx';

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

  expect(obj.value).toStrictEqual({
    arr: [{ a: 1 }]
  });
  expect(obj.getChild('arr').value).toStrictEqual([{ a: 1 }]);
  expect(obj.getChild('arr[0]').value).toStrictEqual({ a: 1 });
  expect(obj.getChild('arr[0].a').value).toBe(1);
});

it.only('can be extended', () => {
  let t = traverser.extendLeafNode(
    Node =>
      class extends Node {
        @observable blurred = false;

        @action.bound
        blur() {
          this.blurred = true;
        }

        @action.bound
        unblur() {
          this.blurred = false;
        }
      }
  );

  t = t.extendParentNode(
    Node =>
      class extends Node {
        @computed
        get blurred() {
          return this.children.some(child => child.blurred);
        }

        @action.bound
        blur() {
          this.children.map(child => child.blur());
        }

        @action.bound
        unblur() {
          this.children.map(child => child.unblur());
        }
      }
  );

  const FormNode = t.createObjectNode({
    name: t.createObjectNode({
      first: t.createLeafNode(),
      last: t.createLeafNode()
    })
  });

  const form = new FormNode({
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
