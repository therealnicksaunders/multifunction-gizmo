import { always, flatten, map, pipe } from 'ramda';
import Type from 'union-type';
import * as Clock from './clock';
import * as Weather from './weather';

const Screen = Type({
  Clock: [],
  Weather: []
});

export const Action = Type({
  ChangeScreen: [Screen],
  Clock: [Clock.Action],
  Weather: [Weather.Action]
});

export const init = () => {
  const [ clock, clockActions ] = Clock.init();
  const [ weather, weatherActions ] = Weather.init();

  return [
    { screen: Screen.Clock, clock, weather },
    Promise
      .all([
        clockActions.then(map(Action.Clock)),
        weatherActions.then(map(Action.Weather))
      ])
      .then(flatten)
  ];
};

export const update = Action.caseOn({
  ChangeScreen: (screen, state) => [ { ...state, screen }, Promise.resolve([]) ],
  Clock: (action, state) => {
    const [ clock, clockActions ] = Clock.update(action, state.clock);
    return [ { ...state, clock }, clockActions.then(map(Action.Clock)) ];
  },
  Weather: (action, state) => {
    const [ weather, weatherActions ] = Weather.update(action, state.weather);
    return [ { ...state, weather }, weatherActions.then(map(Action.Weather)) ];
  }
});

export const view = ({ state, dispatch }) => {
  const content = Screen.case({
    Clock: () => <Clock state={state.clock} dispatch={pipe(Action.Clock, dispatch)} />,
    Weather: () => <Weather state={state.weather} dispatch={pipe(Action.Weather, dispatch)} />
  }, state.screen);

  return (
    <div>
      <button on-click={pipe(always(Screen.Clock), Action.ChangeScreen, dispatch)}>Clock</button>
      <button on-click={pipe(always(Screen.Weather), Action.ChangeScreen, dispatch)}>Weather</button>
      {content}
    </div>
  );
};
