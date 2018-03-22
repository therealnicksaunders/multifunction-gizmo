import Type from 'union-type';
import { always, identity, pipe } from 'ramda';

export const Maybe = Type({
  Just: [ () => true ],
  Nothing: []
});

export const { Just, Nothing } = Maybe;

Maybe.prototype.map = function(fn) {
  return Maybe.case({
    Nothing: always(Maybe.Nothing),
    Just: pipe(fn, Maybe.Just)
  }, this);
};

Maybe.prototype.orJust = function(value) {
  return Maybe.case({
    Nothing: always(value),
    Just: identity
  }, this);
};
