import { Maybe, None, Some } from 'monet';
import { VNode } from 'snabbdom/vnode';
import { html } from 'snabbdom-jsx';
import * as Clock from './clock';
import * as Weather from './weather';

type Screen = 'Clock' | 'Weather';

export type State = { screen: Screen, clock: Clock.State, weather: Weather.State };

export type Action
  = { type: 'ChangeScreen', screen: Screen }
  | { type: 'Clock', action: Clock.Action }
  | { type: 'Weather', action: Weather.Action }
  ;

const mapClockAction: (a: Clock.Action) => Action = action => ({ type: 'Clock', action });

const mapWeatherAction: (a: Weather.Action) => Action = action => ({ type: 'Weather', action });

const mapActionPromise: <TAction>(ma: (a: TAction) => Action) => ((p: Promise<TAction>) => Promise<Action>) =
  mapAction => promise => promise.then(mapAction);

const combineActionPromises: (p: Array<Maybe<Promise<Action>>>) => Maybe<Promise<Array<Action>>> = promises => {
  const some = promises.filter(promise => promise.isSome()).map(promise => promise.some());
  return some.length ? Some(Promise.all(some)) : None();
};

export const init: () => [State, Maybe<Promise<Action | Array<Action>>>] = () => {
  const [ clock, clockAction ] = Clock.init();
  const [ weather, weatherAction ] = Weather.init();

  return [
    { screen: 'Clock', clock, weather },
    combineActionPromises([
      clockAction.map(mapActionPromise(mapClockAction)),
      weatherAction.map(mapActionPromise(mapWeatherAction))
    ])
  ];
};

export const update: (s: State, a: Action) => [State, Maybe<Promise<Action | Array<Action>>>] =
  (state, action) => {
    switch (action.type) {
      case 'ChangeScreen':
        return [{ ...state, screen: action.screen }, None()];
      case 'Clock':
        const [ clock, clockAction ] = Clock.update(state.clock, action.action);
        return [ { ...state, clock }, clockAction.map(mapActionPromise(mapClockAction)) ];
      case 'Weather':
        const [ weather, weatherAction ] = Weather.update(state.weather, action.action);
        return [ { ...state, weather }, weatherAction.map(mapActionPromise(mapWeatherAction)) ];
    }
  };

export const view: (props: { state: State, dispatch: (a: Action) => void }) => VNode =
  ({ state, dispatch }) => {
    let content: VNode;

    switch (state.screen) {
      case 'Clock':
        content = <Clock.view state={state.clock} dispatch={action => dispatch({ type: 'Clock', action })} />;
        break;
      case 'Weather':
        content = <Weather.view state={state.weather} dispatch={action => dispatch({ type: 'Weather', action })} />;
        break;
    }

    return (
      <div>
        <button on-click={() => dispatch({ type: 'ChangeScreen', screen: 'Clock' })}>Clock</button>
        <button on-click={() => dispatch({ type: 'ChangeScreen', screen: 'Weather' })}>Weather</button>
        {content}
      </div>
    );
  };
