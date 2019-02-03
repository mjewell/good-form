import t from 'tcomb';
import traverser from '..';

const StringNode = traverser.createLeafNode(t.String);
const MaybeStringNode = traverser.createLeafNode(t.maybe(t.String));

describe('creation', () => {
  describe('required types', () => {
    it('can be created from a primitive type', () => {
      const leafNode = new StringNode('a');
      expect(leafNode.value).toBe('a');
    });

    it('errors if the value is undefined', () => {
      expect(() => new StringNode()).toThrowError(
        'Invalid value undefined supplied to String'
      );
    });

    it('errors if the type does not match', () => {
      expect(() => new StringNode(1)).toThrowError(
        'Invalid value 1 supplied to String'
      );
    });

    describe('optional types', () => {
      it('can be created from a primitive type', () => {
        const leafNode = new MaybeStringNode('a');
        expect(leafNode.value).toBe('a');
      });

      it('can be created from undefined', () => {
        const leafNode = new MaybeStringNode();
        expect(leafNode.value).toBe(undefined);
      });

      it('errors if the type does not match', () => {
        expect(() => new MaybeStringNode(1)).toThrowError(
          'Invalid value 1 supplied to String'
        );
      });
    });
  });

  describe('setValue', () => {
    it('updates the value when the value is valid', () => {
      const leafNode = new StringNode('a');

      leafNode.setValue('b');
      expect(leafNode.value).toBe('b');
    });

    it('errors when the value is invalid', () => {
      const leafNode = new StringNode('a');

      expect(() => leafNode.setValue(1)).toThrow(
        'Invalid value 1 supplied to String'
      );
    });
  });
});
