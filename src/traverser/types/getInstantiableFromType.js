import t from 'tcomb';
import isType from './isType';
import isNodeDefinition from '../utils/isNodeDefinition';

export default function getInstantiableFromType(type) {
  if (!isType) {
    t.fail(`Invalid type ${type}`);
  }

  if (isNodeDefinition(type)) {
    return type;
  }

  return type.meta.type;
}
