import fetch from '@/service/fetch';
import api from '@/service/interface';

export default {
  namespace: 'global',
  state: {},
  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.state,
      };
    },
  },
  effects: {},
};
