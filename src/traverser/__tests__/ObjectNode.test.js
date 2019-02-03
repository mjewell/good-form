import t from 'tcomb';
import traverser from '..';

const StringNode = traverser.createLeafNode(t.String);
const MaybeStringNode = traverser.createLeafNode(t.maybe(t.String));
const NumberNode = traverser.createLeafNode(t.Number);
const MaybeNumberNode = traverser.createLeafNode(t.maybe(t.Number));

describe('creation', () => {
  describe('required nodes and values', () => {
    const ObjectNode = traverser.createObjectNode({
      a: StringNode,
      b: NumberNode
    });

    it('can be created from an object', () => {
      const objectNode = new ObjectNode({
        a: 'a',
        b: 1
      });

      expect(objectNode.value).toStrictEqual({
        a: 'a',
        b: 1
      });
    });

    it('errors if the value is undefined', () => {
      const expected = expect(() => new ObjectNode());
      expected.toThrowError('Invalid value undefined supplied to LeafNode');
    });

    it('errors if the value isnt an object', () => {
      expect(() => new ObjectNode(1)).toThrowError(
        'ObjectNode value must be a plain object'
      );
    });

    it('errors if the value has the wrong types', () => {
      const expected = expect(
        () =>
          new ObjectNode({
            a: 1,
            b: 'b'
          })
      );
      expected.toThrowError('Invalid value 1 supplied to String');
    });

    it('ignores them if the value has additional properties', () => {
      const objectNode = new ObjectNode({
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
      const expected = expect(
        () =>
          new ObjectNode({
            a: 'a'
          })
      );
      expected.toThrowError('Invalid value undefined supplied to LeafNode');
    });
  });

  describe('optional nodes', () => {
    const ObjectNode = traverser.createObjectNode({
      a: t.maybe(StringNode),
      b: t.maybe(NumberNode)
    });

    it('can be created from an object', () => {
      const objectNode = new ObjectNode({
        a: 'a',
        b: 1
      });

      expect(objectNode.value).toStrictEqual({
        a: 'a',
        b: 1
      });
    });

    it('can be created from undefined', () => {
      const objectNode = new ObjectNode();

      expect(objectNode.value).toStrictEqual({});
    });

    it('errors if the value isnt an object', () => {
      expect(() => new ObjectNode(1)).toThrowError(
        'ObjectNode value must be a plain object'
      );
    });

    it('errors if the value has the wrong types', () => {
      const expected = expect(
        () =>
          new ObjectNode({
            a: 1,
            b: 'b'
          })
      );
      expected.toThrowError('Invalid value 1 supplied to String');
    });

    it('ignores them if the value has additional properties', () => {
      const objectNode = new ObjectNode({
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
      const objectNode = new ObjectNode({
        b: 1
      });

      expect(objectNode.value).toStrictEqual({
        b: 1
      });
    });
  });

  describe.only('optional values', () => {
    const ObjectNode = traverser.createObjectNode({
      a: MaybeStringNode,
      b: MaybeNumberNode
    });

    it('can be created from an object', () => {
      const objectNode = new ObjectNode({
        a: 'a',
        b: 1
      });

      expect(objectNode.value).toStrictEqual({
        a: 'a',
        b: 1
      });
    });

    it.only('can be created from undefined', () => {
      const expected = expect(() => new ObjectNode());
      expected.toThrowError('Invalid value undefined supplied to LeafNode');
    });

    it('errors if the value isnt an object', () => {
      expect(() => new ObjectNode(1)).toThrowError(
        'ObjectNode value must be a plain object'
      );
    });

    it('errors if the value has the wrong types', () => {
      const expected = expect(
        () =>
          new ObjectNode({
            a: 1,
            b: 'b'
          })
      );
      expected.toThrowError('Invalid value 1 supplied to String');
    });

    it('ignores them if the value has additional properties', () => {
      const objectNode = new ObjectNode({
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
      const objectNode = new ObjectNode({
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
    const objectNode = new ObjectNode({
      a: 'a',
      b: 'b'
    });

    objectNode.setValue({
      a: 'a',
      b: 'b',
      c: 'c'
    });

    expect(objectNode.value).toStrictEqual({
      a: 'a',
      b: 'b'
    });
  });

  it('errors when the value is missing required nodes', () => {
    const objectNode = new ObjectNode({
      a: 'a',
      b: 'b'
    });

    expect(() =>
      objectNode.setValue({
        a: 'a'
      })
    ).toThrow('Invalid value undefined supplied to String');
  });

  it('updates nodes when the value contains different values', () => {
    const objectNode = new ObjectNode({
      a: 'a',
      b: 'b'
    });

    objectNode.setValue({
      a: 'x',
      b: 'y'
    });
    expect(objectNode.value).toStrictEqual({
      a: 'x',
      b: 'y'
    });
  });

  it('updates nodes when the value contains nodes', () => {
    const objectNode = new ObjectNode({
      a: 'a',
      b: 'b'
    });

    objectNode.setValue({
      a: objectNode.getChild('a'),
      b: new StringNode('y')
    });
    expect(objectNode.value).toStrictEqual({
      a: 'a',
      b: 'y'
    });
  });

  it('updates nodes when a node is moved', () => {
    const MaybeObjectNode = traverser.createObjectNode({
      a: t.maybe(StringNode),
      b: t.maybe(StringNode)
    });

    const objectNode = new MaybeObjectNode({
      a: 'a',
      b: 'b'
    });

    objectNode.setValue({
      a: objectNode.getChild('b')
    });
    expect(objectNode.value).toStrictEqual({
      a: 'b'
    });
  });

  it('updates nodes when a node is moved and replaced', () => {
    const MaybeObjectNode = traverser.createObjectNode({
      a: t.maybe(StringNode),
      b: t.maybe(StringNode)
    });

    const objectNode = new MaybeObjectNode({
      a: 'a',
      b: 'b'
    });

    objectNode.setValue({
      a: objectNode.getChild('b'),
      b: objectNode.getChild('a')
    });
    expect(objectNode.value).toStrictEqual({
      a: 'b',
      b: 'a'
    });
  });

  it('errors when the value is not an object', () => {
    const objectNode = new ObjectNode({
      a: 'a',
      b: 'b'
    });

    expect(() => objectNode.setValue(1)).toThrow('value must be an object');
  });

  it('errors when the value in the object is invalid', () => {
    const objectNode = new ObjectNode({
      a: 'a',
      b: 'b'
    });

    expect(() =>
      objectNode.setValue({
        a: 1,
        b: 'b'
      })
    ).toThrow('Invalid value 1 supplied to String');
  });
});
