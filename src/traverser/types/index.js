import './tcombOverrides';
import maybe from './maybe';
import String from './String';
import Number from './Number';

// intercept should call types.create to create instance from instance or snapshot

export default {
  Number,
  String,
  maybe
};
