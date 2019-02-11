import t from '..';

const MaybeString = t.maybe(t.String);

describe('create', () => {
  it('returns undefined when created with undefined', () => {
    expect(MaybeString.create()).toBe(undefined);
  });

  it('returns a value when created with a value', () => {
    expect(MaybeString.create('asdf')).toBe('asdf');
  });
});
