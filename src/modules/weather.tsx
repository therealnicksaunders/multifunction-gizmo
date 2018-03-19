import { Maybe, None, Some } from 'monet';
import { VNode } from 'snabbdom/vnode';
import { html } from 'snabbdom-jsx';

export type State = {
  zip: Maybe<String>,
  temperature: Maybe<Number>,
  fetching: Boolean,
  error: Maybe<Error>
};

export const init: () => [State, Maybe<Promise<Action>>] = () => [
  { zip: None(), temperature: None(), fetching: false, error: None() },
  None()
];

export type Action
  = { type: 'SetZip', zip: String }
  | { type: 'SetTemperature', temperature: Number }
  | { type: 'SetError', error: Error }
  ;

export const update: (s: State, a: Action) => [State, Maybe<Promise<Action>>] =
  (state, action) => {
    switch (action.type) {
      case 'SetZip':
        return [
          { ...state, zip: Some(action.zip), fetching: true },
          Some(fetchWeather(action.zip))
        ];
      case 'SetTemperature':
        return [
          { ...state, fetching: false, temperature: Some(action.temperature) },
          None()
        ];
      case 'SetError':
        return [
          { ...state, error: Some(action.error) },
          None()
        ];
    }
  };

export const view: (props: { state: State, dispatch: (a: Action) => void }) => VNode =
  ({ state, dispatch }) => {
    const disabled = state.fetching ? { disabled: '' } : {};

    function updateZip(e: KeyboardEvent) {
      const { value } = e.target as HTMLInputElement;
      value.length === 5 && dispatch({ type: 'SetZip', zip: value });
    }

    return (
      <div>
        <input type="text" size="5" maxlength="5" placeholder="ZIP" {...disabled} on-keypress={updateZip} />
        {state.temperature.map(temp => <p>Current Temperature: <strong>{temp}</strong></p>)}
        {state.error.map(err => <p className="error">{err.message}</p>)}
        <hr />
        Note: Weather results are fake. The temperature is just derived from the first two digits of the ZIP you enter,
        unless you enter a ZIP code beginning with a "3", in which case you will receive an error.
      </div>
    );
  };

function fetchWeather(zip: String): Promise<Action> {
  return new Promise(resolve => setTimeout(resolve, 1000))
    .then(() => {
      if (zip.startsWith('3')) {
        throw new Error('Could not get weather in that area!');
      }
      return { type: 'SetTemperature', temperature: parseInt(zip.substring(0, 2)) } as Action;
    })
    .catch(error => ({ type: 'SetError', error }) as Action);
}
