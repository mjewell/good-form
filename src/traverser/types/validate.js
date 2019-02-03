import './tcombOverrides';
import t from 'tcomb';
import isType from './isType';
import isNodeDefinition from '../utils/isNodeDefinition';
import isNode from '../utils/isNode';

function hasSameName(type, value) {
  if (isNode(value)) {
    return type.name === value.constructor.name;
  }

  return type.name === value;
}

export default function validate(type, value) {
  if (!isType(type)) {
    t.fail(`Invalid type ${t.stringify(type)}`);
  }

  if (!isNodeDefinition(type)) {
    type(value);
    return;
  }

  const sameNameMessage = hasSameName(type, value)
    ? 'These objects have the same name but are not actually the same type'
    : '';

  t.assert(
    value instanceof type,
    [
      `Invalid value ${t.stringify(value)} supplied to ${type.name}`,
      sameNameMessage
    ].join('\n')
  );
}
