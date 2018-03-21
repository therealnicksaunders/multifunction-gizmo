import { VNode } from 'snabbdom/vnode';
import { html } from 'snabbdom-jsx';
import { map } from '../lib/functor/promise-like';
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

export const init: () => [State, PromiseLike<Action>[]] = () => {
  const [ clock, clockActionPromises ] = Clock.init();
  const [ weather, weatherActionPromises ] = Weather.init();

  return [
    { screen: 'Clock', clock, weather },
    []
      .concat(clockActionPromises.map(map(mapClockAction)))
      .concat(weatherActionPromises.map(map(mapWeatherAction)))
  ];
};

export const update: (s: State, a: Action) => [State, PromiseLike<Action>[]] =
  (state, action) => {
    switch (action.type) {
      case 'ChangeScreen':
        return [ { ...state, screen: action.screen }, [] ];
      case 'Clock':
        const [ clock, clockActionPromises ] = Clock.update(state.clock, action.action);
        return [ { ...state, clock }, clockActionPromises.map(map(mapClockAction)) ];
      case 'Weather':
        const [ weather, weatherActionPromises ] = Weather.update(state.weather, action.action);
        return [ { ...state, weather }, weatherActionPromises.map(map(mapWeatherAction)) ];
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
