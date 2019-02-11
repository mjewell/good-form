import t from 'tcomb';
import invariant from 'invariant';

function createNode(BaseClass, callbacks, ...args) {
  return callbacks.reduce(
    (node, callback) => callback(node, ...args),
    BaseClass
  );
}

export default class Traverser {
  static NODE_TYPES = [
    'node',
    'leafNode',
    'parentNode',
    'objectNode',
    'arrayNode'
  ];

  constructor(
    nodeCallbacks = [],
    leafNodeCallbacks = [],
    parentNodeCallbacks = [],
    objectNodeCallbacks = [],
    arrayNodeCallbacks = [],
    context = {}
  ) {
    this.nodeCallbacks = nodeCallbacks;
    this.leafNodeCallbacks = leafNodeCallbacks;
    this.parentNodeCallbacks = parentNodeCallbacks;
    this.objectNodeCallbacks = objectNodeCallbacks;
    this.arrayNodeCallbacks = arrayNodeCallbacks;
    this.context = context;
  }

  extend({
    nodeCallbacks = this.nodeCallbacks,
    leafNodeCallbacks = this.leafNodeCallbacks,
    parentNodeCallbacks = this.parentNodeCallbacks,
    objectNodeCallbacks = this.objectNodeCallbacks,
    arrayNodeCallbacks = this.arrayNodeCallbacks,
    context = this.context
  }) {
    return new Traverser(
      nodeCallbacks,
      leafNodeCallbacks,
      parentNodeCallbacks,
      objectNodeCallbacks,
      arrayNodeCallbacks,
      context
    );
  }

  extendType(type, callback) {
    invariant(
      this.constructor.NODE_TYPES.includes(type),
      `type must be one of ${this.constructor.NODE_TYPES.join(', ')}`
    );

    const key = `${type}Callbacks`;

    return this.extend({
      [key]: [...this[key], callback]
    });
  }

  extendNode(callback) {
    return this.extendType('node', callback);
  }

  extendLeafNode(callback) {
    return this.extendType('leafNode', callback);
  }

  extendParentNode(callback) {
    return this.extendType('parentNode', callback);
  }

  extendObjectNode(callback) {
    return this.extendType('objectNode', callback);
  }

  extendArrayNode(callback) {
    return this.extendType('arrayNode', callback);
  }

  setContext(context) {
    this.context = context;
  }

  createType(BaseClass, callbacks, type, options) {
    const Node = createNode(BaseClass, callbacks, type, options, this.context);

    const nodeType = t.irreducible(
      Node.name,
      nodeOrSnapshot => nodeOrSnapshot instanceof Node
    );

    nodeType.create = (nodeOrSnapshot, ...args) => {
      if (nodeOrSnapshot instanceof Node) {
        return nodeOrSnapshot;
      }

      return new Node(nodeOrSnapshot, ...args);
    };

    return nodeType;
  }

  createLeafNode(type, options) {
    return this.createType(
      class LeafNode {},
      [...this.nodeCallbacks, ...this.leafNodeCallbacks],
      type,
      options
    );
  }

  createObjectNode(type, options) {
    // TODO: assert type has the correct shape

    return this.createType(
      class ObjectNode {},
      [
        ...this.nodeCallbacks,
        ...this.parentNodeCallbacks,
        ...this.objectNodeCallbacks
      ],
      type,
      options
    );
  }

  createArrayNode(type, options) {
    return this.createType(
      class ArrayNode {},
      [
        ...this.nodeCallbacks,
        ...this.parentNodeCallbacks,
        ...this.arrayNodeCallbacks
      ],
      type,
      options
    );
  }
}
