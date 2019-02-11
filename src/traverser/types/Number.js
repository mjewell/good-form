import './tcombOverrides';
import t from 'tcomb';

const { Number } = t;

Number.create = value => {
  Number(value);

  return value;
};

export default Number;
