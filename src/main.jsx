import { forEach } from 'ramda';
import { init } from 'snabbdom';
import propsModule from 'snabbdom/modules/props';
import eventsModule from 'snabbdom/modules/eventlisteners';
import * as App from './modules/app';

const patch = init([ propsModule, eventsModule ]);

const container = document.createElement('div');
document.body.appendChild(container);

let node = container;
let [ state, actions ] = App.init();

function dispatch(action) {
  const update = App.update(action, state);
  state = update[0];
  actions = update[1];
  render();
};

function render() {
  const newNode = <App state={state} dispatch={dispatch} />;
  node = patch(node, newNode);

  if (actions) {
    actions.then(forEach(dispatch));
    actions = null;
  }
};

render();
