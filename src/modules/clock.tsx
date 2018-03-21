import { VNode } from 'snabbdom/vnode';
import { html } from 'snabbdom-jsx';

export type State = { time: String };

export const init: () => [State, PromiseLike<Action>[]] =
  () => [ { time: time() }, [ updateTime() ] ];

export type Action
  = { type: 'SetTime', time: String }
  ;

export const update: (s: State, a: Action) => [State, PromiseLike<Action>[]] =
  (state, action) => {
    switch (action.type) {
      case 'SetTime':
        return [ { ...state, time: action.time }, [ updateTime() ] ];
    }
  };

export const view: (props: { state: State, dispatch: (a: Action) => void }) => VNode =
  ({ state, dispatch }) => <div>{state.time}</div>;

function time(): String {
  return new Date().toLocaleTimeString();
}

function updateTime(): PromiseLike<Action> {
  return new Promise(resolve => setTimeout(resolve, 1000))
    .then(() => ({ type: 'SetTime', time: time() }) as Action);
}
