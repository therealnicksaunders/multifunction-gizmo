import Type from 'union-type';
import { Maybe, Just, Nothing } from '../lib/data.maybe';

export const init = () => [
  {
    zip: Nothing,
    temperature: Nothing,
    fetching: false,
    error: Nothing
  },
  Promise.resolve([])
];

export const Action = Type({
  SetZip: [String],
  SetTemperature: [Number],
  SetError: [Error]
});

export const update = Action.caseOn({
  SetZip: (zip, state) => [ { ...state, zip, fetching: true, temperature: Nothing }, Promise.all([ fetchWeather(zip) ]) ],
  SetTemperature: (temperature, state) => [ { ...state, temperature: Just(temperature), fetching: false }, Promise.resolve([]) ],
  SetError: (error, state) => [ { ...state, error: Just(error) }, Promise.resolve([]) ]
});

export const view = ({ state, dispatch }) => {
  const disabled = state.fetching ? { disabled: '' } : {};
  const updateZip = ({ key, target: { value } }) => key === 'Enter' && dispatch(Action.SetZip(value));

  return (
    <div>
      <input type="text" size="5" maxlength="5" placeholder="ZIP" {...disabled} on-keypress={updateZip} />
      {state.fetching ? <span>Fetching...</span> : <span>(Type ZIP code and press Enter)</span>}
      {state.temperature.map(temperature => <p>Current Temperature: <strong>{temperature}</strong></p>).orJust(<p></p>)}
      {state.error.map(error => <p className="error"><strong>Error!</strong> {error.message}</p>).orJust(<p></p>)}
      <hr />
      Note: Weather results are fake. The temperature is just derived from the first two digits of the ZIP you enter,
      unless you enter a ZIP code beginning with a "3", in which case you will receive an error.
    </div>
  );
};

function fetchWeather(zip) {
  return new Promise(resolve => setTimeout(resolve, 1000))
    .then(() => {
      if (zip.indexOf('3') === 0) {
        throw new Error('Could not get weather in that area!');
      }
      return Action.SetTemperature(parseInt(zip.substring(0, 2)));
    })
    .catch(Action.SetError);
}
