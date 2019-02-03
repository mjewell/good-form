import t from 'tcomb';
import traverser from '../..';
import validate from '../validate';

it('validates a primitive tcomb type', () => {
  const type = t.String;
  expect(() => validate(type)).toThrowError(
    'Invalid value undefined supplied to String'
  );
  expect(() => validate(type, 1)).toThrowError(
    'Invalid value 1 supplied to String'
  );
  expect(() => validate(type, 'asfd')).not.toThrowError();
});

it('validates a modified tcomb type', () => {
  const type = t.maybe(t.String);
  expect(() => validate(type)).not.toThrowError();
  expect(() => validate(type, 1)).toThrowError(
    'Invalid value 1 supplied to String'
  );
  expect(() => validate(type, 'asfd')).not.toThrowError();
});

it('validates a node', () => {
  const Node = traverser.createLeafNode(t.String);
  const OtherNode = traverser.createLeafNode(t.String);

  expect(() => validate(Node)).toThrowError(
    'Invalid value undefined supplied to LeafNode'
  );
  expect(() => validate(Node, 1)).toThrowError(
    'Invalid value 1 supplied to LeafNode'
  );
  expect(() => validate(Node, new Node('asdf'))).not.toThrowError();
  expect(() => validate(Node, new OtherNode('asdf'))).toThrowError(
    /Invalid value \{.*\}<LeafNode> supplied to LeafNode\nThese objects have the same name but are not actually the same type/s
  );
});

it.only('validates a modified node', () => {
  const Node = traverser.createLeafNode(t.String);
  const OtherNode = traverser.createLeafNode(t.String);
  const MaybeNode = t.maybe(Node);

  // expect(() => validate(MaybeNode)).not.toThrowError();
  // expect(() => validate(MaybeNode, 1)).toThrowError(
  //   'Invalid value 1 supplied to LeafNode'
  // );
  // expect(() => validate(MaybeNode, new Node('asdf'))).not.toThrowError();
  expect(() => validate(MaybeNode, new OtherNode('asdf'))).toThrowError(
    /Invalid value \{.*\}<LeafNode> supplied to LeafNode\nThese objects have the same name but are not actually the same type/s
  );
});

it('validates only the top level of a nested node', () => {});
