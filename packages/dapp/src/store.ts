import models from '@/models';
import dva from '@/utils/dva';

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
});

export const store = dvaApp.getStore();
