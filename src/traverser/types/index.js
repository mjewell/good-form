import './tcombOverrides';
import t from 'tcomb';

function maybe(...args) {
  const type = t.maybe(...args);

  const innerType = type.meta.type;

  type.create = (...createArgs) => innerType.create(...createArgs);

  return type;
}

const { String, Number } = t;

export default {
  String,
  Number,
  maybe
};
