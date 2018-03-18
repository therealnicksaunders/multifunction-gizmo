import { Maybe, None } from 'monet';
import { VNode } from 'snabbdom/vnode';
import { html } from 'snabbdom-jsx';
import * as Clock from './clock';

type Screen = 'Clock' | 'Weather';

export type State = { screen: Screen, clock: Clock.State };

export const init: () => [State, Maybe<Promise<Action>>] = () => {
  const [ clock, clockAction ] = Clock.init();
  return [
    { screen: 'Clock', clock },
    clockAction.map(actionPromise => actionPromise.then(action => ({ type: 'Clock', action }) as Action))
  ];
};

export type Action
  = { type: 'ChangeScreen', screen: Screen }
  | { type: 'Clock', action: Clock.Action }
  ;

export const update: (s: State, a: Action) => [State, Maybe<Promise<Action>>] =
  (state, action) => {
    switch (action.type) {
      case 'ChangeScreen':
        return [{ ...state, screen: action.screen }, None()];
      case 'Clock':
        const [ clock, clockAction ] = Clock.update(state.clock, action.action);
        return [
          { ...state, clock },
          clockAction.map(actionPromise => actionPromise.then(action => ({ type: 'Clock', action }) as Action))
        ];
    }
  };

export const view: (props: { state: State, dispatch: (a: Action) => void }) => VNode =
  ({ state, dispatch }) => {
    let content: VNode;

    switch (state.screen) {
      case 'Clock':
        content = <Clock.view state={state.clock} dispatch={action => ({ type: 'Clock', action })} />;
        break;
      case 'Weather':
        content = <div>Weather - not implemented yet</div>;
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
