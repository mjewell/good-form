import { types } from 'mobx-state-tree';
import invariant from 'invariant';
import isPlainObject from 'lodash/isPlainObject';

function createNode(name, callbacks, type, options, context) {
  return callbacks.reduce(
    (node, callback) => callback(node, type, options, context),
    types.model(name)
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

  createLeafNode(type, options) {
    return createNode(
      'LeafNode',
      [...this.nodeCallbacks, ...this.leafNodeCallbacks],
      type,
      options,
      this.context
    );
  }

  createObjectNode(type, options) {
    return createNode(
      'ObjectNode',
      [
        ...this.nodeCallbacks,
        ...this.parentNodeCallbacks,
        ...this.objectNodeCallbacks
      ],
      isPlainObject(type) ? types.model(type) : types.map(type),
      options,
      this.context
    );
  }

  createArrayNode(type, options) {
    return createNode(
      'ArrayNode',
      [
        ...this.nodeCallbacks,
        ...this.parentNodeCallbacks,
        ...this.arrayNodeCallbacks
      ],
      types.array(type),
      options,
      this.context
    );
  }
}
