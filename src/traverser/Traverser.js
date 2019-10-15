import invariant from 'invariant';
import isPlainObject from 'lodash/isPlainObject';
import isNodeDefinition from './utils/isNodeDefinition';

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

  createLeafNode(options) {
    return createNode(
      class LeafNode {},
      [...this.nodeCallbacks, ...this.leafNodeCallbacks],
      null,
      options
    );
  }

  createObjectNode(type, options) {
    const isMapType = isNodeDefinition(type);
    const isObjectType =
      isPlainObject(type) &&
      Object.values(type).every(t => isNodeDefinition(t));

    invariant(
      isMapType || isObjectType,
      'type must be a node definition or an object with node definitions as values'
    );

    return createNode(
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
    invariant(isNodeDefinition(type), 'type must be a node definition');

    return createNode(
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
