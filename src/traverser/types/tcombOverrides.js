import t from 'tcomb';
import isNode from '../utils/isNode';

const originalStringify = t.stringify;

t.stringify = value => {
  if (isNode(value)) {
    return `${originalStringify(value)}<${value.constructor.name}>`;
  }

  return originalStringify(value);
};
