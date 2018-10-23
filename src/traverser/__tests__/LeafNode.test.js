import { types } from 'mobx-state-tree';
import traverser from '..';

const StringNode = traverser.createLeafNode(types.string);
const MaybeStringNode = traverser.createLeafNode(types.maybe(types.string));

describe('creation', () => {
  describe('required types', () => {
    it('can be created from a primitive type', () => {
      const leafNode = StringNode.create('a');
      expect(leafNode.value).toBe('a');
    });

    it('errors if the value is undefined', () => {
      expect(() => StringNode.create()).toThrowError(
        'at path "/value" value `undefined` is not assignable to type: `string`'
      );
    });

    it('errors if the type does not match', () => {
      expect(() => StringNode.create(1)).toThrowError(
        'at path "/value" value `1` is not assignable to type: `string`'
      );
    });
  });

  describe('optional types', () => {
    it('can be created from a primitive type', () => {
      const leafNode = MaybeStringNode.create('a');
      expect(leafNode.value).toBe('a');
    });

    it('can be created from undefined', () => {
      const leafNode = MaybeStringNode.create();
      expect(leafNode.value).toBe(undefined);
    });

    it('errors if the type does not match', () => {
      expect(() => MaybeStringNode.create(1)).toThrowError(
        'at path "/value" value `1` is not assignable to type: `(string | undefined)`'
      );
    });
  });
});

describe('setValue', () => {
  it('updates the value when the value is valid', () => {
    const leafNode = StringNode.create('a');

    leafNode.setValue('b');
    expect(leafNode.value).toBe('b');
  });

  it('errors when the value is invalid', () => {
    const leafNode = StringNode.create('a');

    expect(() => leafNode.setValue(1)).toThrow(
      'value `1` is not assignable to type: `string`'
    );
  });
});
