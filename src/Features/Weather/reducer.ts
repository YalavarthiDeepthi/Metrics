import { createSlice, PayloadAction } from 'redux-starter-kit';

export type WeatherForLocation = {
  description: string;
  locationName: string;
  temperatureinCelsius: number;
};

export type ApiErrorAction = {
  error: string;
};

export type newMeasurementType = {
  data?: any;
};

export type metricNameType = {
  metricNames: Array<string>;
  getMeasurements: Array<Object>;
  getNewMeasurement: Object;
};

const initialState = {
  temperatureinCelsius: 0,
  temperatureinFahrenheit: 0,
  description: '',
  locationName: '',
  metricNames: Array<string>(),
  getMeasurements: Array<Object>(),
  getNewMeasurement: Object,
};

const toF = (c: number) => (c * 9) / 5 + 32;

const slice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    weatherDataRecevied: (state, action: PayloadAction<WeatherForLocation>) => {
      const { description, locationName, temperatureinCelsius } = action.payload;
      state.temperatureinCelsius = temperatureinCelsius;
      state.temperatureinFahrenheit = toF(temperatureinCelsius);
      state.description = description;
      state.locationName = locationName;
    },

    //set the data in store
    storeMetricNames: (state, action: PayloadAction<Array<string>>) => {
      state.metricNames = action.payload;
    },

    storeMultipleMeasurements: (state, action: PayloadAction<Array<string>>) => {
      state.getMeasurements = action.payload;
    },

    storeNewMeasurement: (state, action: PayloadAction<newMeasurementType>) => {
      const { data } = action.payload;
      state.getNewMeasurement = data || {}; 
    },

    weatherApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
