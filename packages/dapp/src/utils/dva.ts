import { create } from 'dva-core';
import createLoading from 'dva-loading';

let app;
let store;
let dispatch;
let registered;

const createApp = opt => {
  // redux日志
  // if (process.env.BUILD_ENV !== 'production') {
  //   opt.onAction = [require('redux-logger').createLogger()];
  // }

  app = create(opt);
  app.use(createLoading({}));

  if (!registered) opt.models.forEach(model => app.model(model));
  registered = true;
  app.start();

  store = app._store;
  app.getStore = () => store;
  app.use({
    onError(err) {
      console.error(err);
    },
  });

  dispatch = store.dispatch;

  app.dispatch = dispatch;
  return app;
};

export default {
  createApp,
  getDispatch() {
    return app.dispatch;
  },
};
