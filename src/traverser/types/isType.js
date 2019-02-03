import { isType as isTcombType } from 'tcomb';
import isNodeDefinition from '../utils/isNodeDefinition';

export default function isType(type) {
  return isTcombType(type) || isNodeDefinition(type);
}
