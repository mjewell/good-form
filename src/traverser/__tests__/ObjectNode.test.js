import { types } from 'mobx-state-tree';
import traverser from '..';

const StringNode = traverser.createLeafNode(types.string);
const MaybeStringNode = traverser.createLeafNode(types.maybe(types.string));
const NumberNode = traverser.createLeafNode(types.number);
const MaybeNumberNode = traverser.createLeafNode(types.maybe(types.number));

describe('creation', () => {
  describe('required nodes and values', () => {
    const ObjectNode = traverser.createObjectNode({
      a: StringNode,
      b: NumberNode
    });

    it('can be created from an object', () => {
      const objectNode = ObjectNode.create({
        a: 'a',
        b: 1
      });

      expect(objectNode.value).toStrictEqual({
        a: 'a',
        b: 1
      });
    });

    it('errors if the value is undefined', () => {
      const expected = expect(() => ObjectNode.create());
      expected.toThrowError(
        'at path "/children/collection/a/value" value `undefined` is not assignable to type: `string`'
      );
      expected.toThrowError(
        'at path "/children/collection/b/value" value `undefined` is not assignable to type: `number`'
      );
    });

    it('errors if the value isnt an object', () => {
      expect(() => ObjectNode.create(1)).toThrowError(
        'at path "/children/collection" value `1` is not assignable to type: `AnonymousModel`'
      );
    });

    it('errors if the value has the wrong types', () => {
      const expected = expect(() =>
        ObjectNode.create({
          a: 1,
          b: 'b'
        })
      );
      expected.toThrowError(
        'at path "/children/collection/a/value" value `1` is not assignable to type: `string`'
      );
      expected.toThrowError(
        'at path "/children/collection/b/value" value `"b"` is not assignable to type: `number`'
      );
    });

    it('ignores them if the value has additional properties', () => {
      const objectNode = ObjectNode.create({
        a: 'a',
        b: 1,
        c: 'c'
      });

      expect(objectNode.value).toStrictEqual({
        a: 'a',
        b: 1
      });
    });

    it('errors if the value has missing properties', () => {
      const expected = expect(() =>
        ObjectNode.create({
          a: 1
        })
      );
      expected.toThrowError(
        'at path "/children/collection/a/value" value `1` is not assignable to type: `string`'
      );
      expected.toThrowError(
        'at path "/children/collection/b/value" value `undefined` is not assignable to type: `number`'
      );
    });
  });

  describe('optional nodes', () => {
    const ObjectNode = traverser.createObjectNode({
      a: types.maybe(StringNode),
      b: types.maybe(NumberNode)
    });

    it('can be created from an object', () => {
      const objectNode = ObjectNode.create({
        a: 'a',
        b: 1
      });

      expect(objectNode.value).toStrictEqual({
        a: 'a',
        b: 1
      });
    });

    it('can be created from undefined', () => {
      const objectNode = ObjectNode.create();

      expect(objectNode.value).toStrictEqual({});
    });

    it('errors if the value isnt an object', () => {
      expect(() => ObjectNode.create(1)).toThrowError(
        'at path "/children/collection" value `1` is not assignable to type: `AnonymousModel`'
      );
    });

    it('errors if the value has the wrong types', () => {
      const expected = expect(() =>
        ObjectNode.create({
          a: 1,
          b: 'b'
        })
      );
      expected.toThrowError(
        'at path "/children/collection/a" value `1` is not assignable to type: `(LeafNode | undefined)`'
      );
      expected.toThrowError(
        'at path "/children/collection/b" value `"b"` is not assignable to type: `(LeafNode | undefined)`'
      );
    });

    it('ignores them if the value has additional properties', () => {
      const objectNode = ObjectNode.create({
        a: 'a',
        b: 1,
        c: 'c'
      });

      expect(objectNode.value).toStrictEqual({
        a: 'a',
        b: 1
      });
    });

    it('can be created from an object with missing properties', () => {
      const objectNode = ObjectNode.create({
        b: 1
      });

      expect(objectNode.value).toStrictEqual({
        b: 1
      });
    });
  });

  describe('optional values', () => {
    const ObjectNode = traverser.createObjectNode({
      a: MaybeStringNode,
      b: MaybeNumberNode
    });

    it('can be created from an object', () => {
      const objectNode = ObjectNode.create({
        a: 'a',
        b: 1
      });

      expect(objectNode.value).toStrictEqual({
        a: 'a',
        b: 1
      });
    });

    it('can be created from undefined', () => {
      const objectNode = ObjectNode.create();

      expect(objectNode.value).toStrictEqual({
        a: undefined,
        b: undefined
      });
    });

    it('errors if the value isnt an object', () => {
      expect(() => ObjectNode.create(1)).toThrowError(
        'at path "/children/collection" value `1` is not assignable to type: `AnonymousModel`'
      );
    });

    it('errors if the value has the wrong types', () => {
      const expected = expect(() =>
        ObjectNode.create({
          a: 1,
          b: 'b'
        })
      );
      expected.toThrowError(
        'at path "/children/collection/a/value" value `1` is not assignable to type: `(string | undefined)`'
      );
      expected.toThrowError(
        'at path "/children/collection/b/value" value `"b"` is not assignable to type: `(number | undefined)`'
      );
    });

    it('ignores them if the value has additional properties', () => {
      const objectNode = ObjectNode.create({
        a: 'a',
        b: 1,
        c: 'c'
      });

      expect(objectNode.value).toStrictEqual({
        a: 'a',
        b: 1
      });
    });

    it('can be created from an object with missing properties', () => {
      const objectNode = ObjectNode.create({
        b: 1
      });

      expect(objectNode.value).toStrictEqual({
        a: undefined,
        b: 1
      });
    });
  });
});

describe('setValue', () => {
  const ObjectNode = traverser.createObjectNode({
    a: StringNode,
    b: StringNode
  });

  it('ignores nodes that are not in the original set', () => {
    const objectNode = ObjectNode.create({
      a: 'a',
      b: 'b'
    });

    objectNode.setValue({
      a: 'a',
      b: 'b',
      c: 'c'
    });
    expect(objectNode.value).toEqual({
      a: 'a',
      b: 'b'
    });
  });

  it('errors when the value is missing required nodes', () => {
    const objectNode = ObjectNode.create({
      a: 'a',
      b: 'b'
    });

    expect(() =>
      objectNode.setValue({
        a: 'a'
      })
    ).toThrow(
      'at path "/value" value `undefined` is not assignable to type: `string`'
    );
  });

  it('updates nodes when the value contains different values', () => {
    const objectNode = ObjectNode.create({
      a: 'a',
      b: 'b'
    });

    objectNode.setValue({
      a: 'x',
      b: 'y'
    });
    expect(objectNode.value).toEqual({
      a: 'x',
      b: 'y'
    });
  });

  it('updates nodes when the value contains nodes', () => {
    const objectNode = ObjectNode.create({
      a: 'a',
      b: 'b'
    });

    objectNode.setValue({
      a: objectNode.getChild('a'),
      b: StringNode.create('y')
    });
    expect(objectNode.value).toEqual({
      a: 'a',
      b: 'y'
    });
  });

  it('updates nodes when a node is moved', () => {
    const MaybeObjectNode = traverser.createObjectNode({
      a: types.maybe(StringNode),
      b: types.maybe(StringNode)
    });

    const objectNode = MaybeObjectNode.create({
      a: 'a',
      b: 'b'
    });

    objectNode.setValue({
      a: objectNode.getChild('b')
    });
    expect(objectNode.value).toEqual({
      a: 'b'
    });
  });

  it.skip('updates nodes when a node is moved and replaced', () => {
    const MaybeObjectNode = traverser.createObjectNode({
      a: types.maybe(StringNode),
      b: types.maybe(StringNode)
    });

    const objectNode = MaybeObjectNode.create({
      a: 'a',
      b: 'b'
    });

    objectNode.setValue({
      a: objectNode.getChild('b'),
      b: objectNode.getChild('a')
    });
    expect(objectNode.value).toEqual({
      a: 'b',
      b: 'a'
    });
  });

  it('errors when the value is not an object', () => {
    const objectNode = ObjectNode.create({
      a: 'a',
      b: 'b'
    });

    expect(() => objectNode.setValue(1)).toThrow('value must be an object');
  });

  it('errors when the value in the object is invalid', () => {
    const objectNode = ObjectNode.create({
      a: 'a',
      b: 'b'
    });

    expect(() =>
      objectNode.setValue({
        a: 1,
        b: 'b'
      })
    ).toThrow('value `1` is not assignable to type: `string`');
  });
});
