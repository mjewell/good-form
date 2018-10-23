import { types } from 'mobx-state-tree';
import traverser from '..';

const StringNode = traverser.createLeafNode(types.string);
const MaybeStringNode = traverser.createLeafNode(types.maybe(types.string));

describe('creation', () => {
  describe('required values', () => {
    const MapNode = traverser.createObjectNode(StringNode);

    it('can be created from an object', () => {
      const objectNode = MapNode.create({
        a: 'a',
        b: 'b'
      });

      expect(objectNode.value).toStrictEqual({
        a: 'a',
        b: 'b'
      });
    });

    it('has no values if the value is undefined', () => {
      const objectNode = MapNode.create();

      expect(objectNode.value).toStrictEqual({});
    });

    it('errors if the value isnt an object', () => {
      expect(() => MapNode.create(1)).toThrowError(
        'at path "/children/collection" value `1` is not assignable to type: `map<string, LeafNode>`'
      );
    });

    it('errors if the value has the wrong types', () => {
      expect(() =>
        MapNode.create({
          a: 1,
          b: 'b'
        })
      ).toThrowError(
        'at path "/children/collection/a/value" value `1` is not assignable to type: `string`'
      );
    });
  });

  describe('optional values', () => {
    const MapNode = traverser.createObjectNode(MaybeStringNode);

    it('can be created from an object', () => {
      const objectNode = MapNode.create({
        a: 'a',
        b: 'b'
      });

      expect(objectNode.value).toStrictEqual({
        a: 'a',
        b: 'b'
      });
    });

    it('has no values if the value is undefined', () => {
      const objectNode = MapNode.create();

      expect(objectNode.value).toStrictEqual({});
    });

    it('errors if the value isnt an object', () => {
      expect(() => MapNode.create(1)).toThrowError(
        'at path "/children/collection" value `1` is not assignable to type: `map<string, LeafNode>`'
      );
    });

    it('errors if the value has the wrong types', () => {
      expect(() =>
        MapNode.create({
          a: 1,
          b: 'b'
        })
      ).toThrowError(
        'at path "/children/collection/a/value" value `1` is not assignable to type: `(string | undefined)`'
      );
    });
  });
});

describe('setValue', () => {
  const MapNode = traverser.createObjectNode(StringNode);

  it('adds nodes when the value contains more elements', () => {
    const mapNode = MapNode.create({
      a: 'a',
      b: 'b'
    });

    mapNode.setValue({
      a: 'a',
      b: 'b',
      c: 'c'
    });
    expect(mapNode.value).toEqual({
      a: 'a',
      b: 'b',
      c: 'c'
    });
  });

  it('removes nodes when the value contains fewer elements', () => {
    const mapNode = MapNode.create({
      a: 'a',
      b: 'b'
    });

    mapNode.setValue({
      a: 'a'
    });
    expect(mapNode.value).toEqual({
      a: 'a'
    });
  });

  it('updates nodes when the value contains different values', () => {
    const mapNode = MapNode.create({
      a: 'a',
      b: 'b'
    });

    mapNode.setValue({
      a: 'x',
      b: 'y'
    });
    expect(mapNode.value).toEqual({
      a: 'x',
      b: 'y'
    });
  });

  it('updates nodes when the value contains nodes', () => {
    const mapNode = MapNode.create({
      a: 'a',
      b: 'b'
    });

    mapNode.setValue({
      a: mapNode.getChild('a'),
      b: StringNode.create('y')
    });
    expect(mapNode.value).toEqual({
      a: 'a',
      b: 'y'
    });
  });

  it('updates nodes when a node is moved', () => {
    const mapNode = MapNode.create({
      a: 'a',
      b: 'b'
    });

    mapNode.setValue({
      a: mapNode.getChild('b')
    });
    expect(mapNode.value).toEqual({
      a: 'b'
    });
  });

  it.skip('updates nodes when a node is moved and replaced', () => {
    const mapNode = MapNode.create({
      a: 'a',
      b: 'b'
    });

    mapNode.setValue({
      a: mapNode.getChild('b'),
      b: mapNode.getChild('a')
    });
    expect(mapNode.value).toEqual({
      a: 'b',
      b: 'a'
    });
  });

  it('errors when the value is not an object', () => {
    const mapNode = MapNode.create({
      a: 'a',
      b: 'b'
    });

    expect(() => mapNode.setValue(1)).toThrow('value must be an object');
  });

  it('errors when the value in the object is invalid', () => {
    const mapNode = MapNode.create({
      a: 'a',
      b: 'b'
    });

    expect(() =>
      mapNode.setValue({
        a: 1,
        b: 'b'
      })
    ).toThrow('value `1` is not assignable to type: `string`');
  });
});
