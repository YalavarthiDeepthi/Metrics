import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
};

export type newMeasurementType = {
  data?: any;
};

interface Measurement {
  metric: string;
  at: any;
  value: number;
  unit: string;
  __typename: string;
}

interface GetMeasurements {
  metric: string;
  measurements: Measurement;
}

const initialState = {
  metricNames: Array<string>(),
  getMeasurements: Array<GetMeasurements>(),
  getNewMeasurement: Array<Measurement>(),
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    //set the data in store
    storeMetricNames: (state, action: PayloadAction<Array<string>>) => {
      if ([...state.metricNames] !== action.payload) {
        state.getNewMeasurement = [];
      }
      state.metricNames = action.payload;
    },

    storeMultipleMeasurements: (state, action: PayloadAction<Array<GetMeasurements>>) => {
      state.getMeasurements = action.payload;
    },

    storeNewMeasurement: (state, action: PayloadAction<newMeasurementType>) => {
      const { data } = action.payload;
      var newMeasurement: any = data && Object.values(data)[0];
      var getNew = [];
      getNew.push(...state.getNewMeasurement, newMeasurement);
      state.getNewMeasurement = getNew || {};
    },

    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
