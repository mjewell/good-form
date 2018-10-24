import { types } from 'mobx-state-tree';
import traverser from '..';

const StringNode = traverser.createLeafNode(types.string);
const MaybeStringNode = traverser.createLeafNode(types.maybe(types.string));
const StringArrayNode = traverser.createArrayNode(StringNode);
const MaybeStringArrayNode = traverser.createArrayNode(MaybeStringNode);

describe('creation', () => {
  describe('required values', () => {
    it('can be created from an array', () => {
      const arrayNode = StringArrayNode.create(['a', 'b']);

      expect(arrayNode.value).toStrictEqual(['a', 'b']);
    });

    it('errors if the value is undefined', () => {
      expect(() => StringArrayNode.create()).toThrowError(
        'at path "/children/collection" snapshot `{}` is not assignable to type: `LeafNode[]`'
      );
    });

    it('errors if the value isnt an array', () => {
      expect(() => StringArrayNode.create(1)).toThrowError(
        'at path "/children/collection" value `1` is not assignable to type: `LeafNode[]`'
      );
    });

    it('errors if the value has the wrong types', () => {
      expect(() => StringArrayNode.create([1, 'b'])).toThrowError(
        'at path "/children/collection/0/value" value `1` is not assignable to type: `string`'
      );
    });
  });

  describe('optional values', () => {
    it('can be created from an array', () => {
      const arrayNode = MaybeStringArrayNode.create(['a', 'b']);

      expect(arrayNode.value).toStrictEqual(['a', 'b']);
    });

    it('errors if the value is undefined', () => {
      expect(() => MaybeStringArrayNode.create()).toThrowError(
        'at path "/children/collection" snapshot `{}` is not assignable to type: `LeafNode[]`'
      );
    });

    it('errors if the value isnt an array', () => {
      expect(() => MaybeStringArrayNode.create(1)).toThrowError(
        'at path "/children/collection" value `1` is not assignable to type: `LeafNode[]`'
      );
    });

    it('errors if the value has the wrong types', () => {
      expect(() => MaybeStringArrayNode.create([1, 'b'])).toThrowError(
        'at path "/children/collection/0/value" value `1` is not assignable to type: `(string | undefined)`'
      );
    });
  });
});

describe('setValue', () => {
  it('adds nodes when the value contains more elements', () => {
    const arrayNode = StringArrayNode.create(['a', 'b', 'd']);

    arrayNode.setValue(['a', 'b', 'c', 'd']);
    expect(arrayNode.value).toStrictEqual(['a', 'b', 'c', 'd']);
  });

  it('removes nodes when the value contains fewer elements', () => {
    const arrayNode = StringArrayNode.create(['a', 'b', 'c', 'd']);

    arrayNode.setValue(['a', 'b', 'd']);
    expect(arrayNode.value).toStrictEqual(['a', 'b', 'd']);
  });

  it('updates nodes when the value contains different elements', () => {
    const arrayNode = StringArrayNode.create(['a', 'b']);

    arrayNode.setValue(['x', 'y']);
    expect(arrayNode.value).toStrictEqual(['x', 'y']);
  });

  it('updates nodes when the value contains nodes', () => {
    const arrayNode = StringArrayNode.create(['a', 'b']);

    arrayNode.setValue([arrayNode.getChild(0), 'b', StringNode.create('c')]);
    expect(arrayNode.value).toStrictEqual(['a', 'b', 'c']);
  });

  it('updates nodes when a node is moved', () => {
    const arrayNode = StringArrayNode.create(['a', 'b', 'c']);

    arrayNode.setValue([arrayNode.getChild(0), arrayNode.getChild(2)]);
    expect(arrayNode.value).toStrictEqual(['a', 'c']);
  });

  it('updates nodes when a node is moved and replaced', () => {
    const arrayNode = StringArrayNode.create(['a', 'b', 'c']);

    arrayNode.setValue([arrayNode.getChild(1), arrayNode.getChild(2)]);
    expect(arrayNode.value).toStrictEqual(['b', 'c']);
  });

  it('errors when the value is not an array', () => {
    const arrayNode = StringArrayNode.create(['a']);

    expect(() => arrayNode.setValue(1)).toThrow('value must be an array');
  });

  it('errors when the value in the array is invalid', () => {
    const arrayNode = StringArrayNode.create(['a']);

    expect(() => arrayNode.setValue([1])).toThrow(
      'at path "/value" value `1` is not assignable to type: `string`'
    );
  });
});
