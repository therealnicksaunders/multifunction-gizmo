import { Maybe, None, Some } from 'monet';
import { VNode } from 'snabbdom/vnode';
import { html } from 'snabbdom-jsx';

export type State = { time: String };

export const init: () => [State, Maybe<Promise<Action>>] = () => [
  { time: time() },
  Some(new Promise(resolve => setTimeout(resolve, 1000)).then(() => ({ type: 'SetTime', time: time() }) as Action))
];

export type Action
  = { type: 'SetTime', time: String }
  ;

export const update: (s: State, a: Action) => [State, Maybe<Promise<Action>>] =
  (state, action) => {
    switch (action.type) {
      case 'SetTime':
        return [
          { ...state, time: action.time },
          Some(
            new Promise(resolve => setTimeout(resolve, 1000))
              .then(() => ({ type: 'SetTime', time: time() }) as Action)
          )
        ];
    }
  };

export const view: (props: { state: State, dispatch: (a: Action) => void }) => VNode =
  ({ state, dispatch }) => <div>{state.time}</div>;

function time(): String {
  return new Date().toLocaleTimeString();
}
