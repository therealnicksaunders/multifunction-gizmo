import { init } from 'snabbdom';
import { VNode } from 'snabbdom/vnode';
import eventModule from 'snabbdom/modules/eventlisteners';
import { html } from 'snabbdom-jsx';
import { Maybe } from 'monet';
import * as App from './modules/app';

const patch = init([ eventModule ]);

const container = document.createElement('div');
document.body.appendChild(container);

let node: Element | VNode = container;
let [ state, actionPromise ] = App.init();

function dispatch(action: App.Action): void {
  const update = App.update(state, action);
  state = update[0];
  actionPromise = update[1];
  render();
};

function render(): void {
  const newNode = <App.view state={state} dispatch={dispatch} />;
  node = patch(node, newNode);
  actionPromise.isSome() && actionPromise.some().then(dispatch);
};

render();
