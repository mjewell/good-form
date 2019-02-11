import './tcombOverrides';
import t from 'tcomb';

export default function maybe(...args) {
  const type = t.maybe(...args);

  const innerType = type.meta.type;

  type.create = (...createArgs) => {
    if (t.Nil.is(createArgs[0])) {
      return undefined;
    }

    return innerType.create(...createArgs);
  };

  return type;
}
