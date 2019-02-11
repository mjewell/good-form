import './tcombOverrides';
import t from 'tcomb';

const { String } = t;

String.create = value => {
  String(value);

  return value;
};

export default String;
