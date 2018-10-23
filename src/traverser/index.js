import Traverser from './Traverser';
import extendNode from './extensions/extendNode';
import extendLeafNode from './extensions/extendLeafNode';
import extendParentNode from './extensions/extendParentNode';
import extendObjectNode from './extensions/extendObjectNode';
import extendArrayNode from './extensions/extendArrayNode';

// eslint-disable-next-line import/no-mutable-exports
let traverser = new Traverser();
traverser = traverser.extendNode(extendNode);
traverser = traverser.extendLeafNode(extendLeafNode);
traverser = traverser.extendParentNode(extendParentNode);
traverser = traverser.extendObjectNode(extendObjectNode);
traverser = traverser.extendArrayNode(extendArrayNode);

export default traverser;
