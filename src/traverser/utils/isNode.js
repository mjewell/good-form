export default function isNode(valueOrNode) {
  return valueOrNode && valueOrNode.isTraverserNode;
}
