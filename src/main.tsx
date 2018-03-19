import { init } from 'snabbdom';
import { VNode } from 'snabbdom/vnode';
import propsModule from 'snabbdom/modules/props';
import eventModule from 'snabbdom/modules/eventlisteners';
import { html } from 'snabbdom-jsx';
import * as App from './modules/app';

const patch = init([ propsModule, eventModule ]);

const container = document.createElement('div');
document.body.appendChild(container);

let node: Element | VNode = container;
let [ state, actionPromises ] = App.init();

function dispatch(actions: App.Action | App.Action[]): void {
  (actions instanceof Array ? actions : [actions as App.Action])
    .forEach(action => {
      const update = App.update(state, action);
      state = update[0];
      actionPromises = update[1];
      render();
    });
};

function render(): void {
  const newNode = <App.view state={state} dispatch={dispatch} />;
  node = patch(node, newNode);

  if (actionPromises.length) {
    Promise.all(actionPromises).then(dispatch);
    actionPromises = [];
  }
};

render();
