import Type from 'union-type';

export const init = () => [
  { time: time() },
  Promise.all([ updateTime() ])
];

export const Action = Type({
  SetTime: [String]
});

export const update = (state, action) => Action.case({
  SetTime: time => [ { ...state, time }, Promise.all([ updateTime() ]) ]
}, action);

export const view = ({ state, dispatch }) => <div>{state.time}</div>;

function time() {
  return new Date().toLocaleTimeString();
}

function updateTime() {
  return new Promise(resolve => setTimeout(resolve, 1000)).then(() => Action.SetTime(time()));
}
