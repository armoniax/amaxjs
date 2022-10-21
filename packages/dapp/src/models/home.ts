import fetch from '@/service/fetch';
import api from '@/service/interface';

export default {
  namespace: 'home',
  state: {
    list: [],
  },
  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.state,
      };
    },
  },
  effects: {
    /**
     * 热门商品
     */
    *getList({}, { call, put }) {
      try {
        const { data } = yield call(fetch.get, api.getList, {
          params: {
            page: 1,
            size: 4,
          },
        });
        if (!data) {
          return;
        }
        yield put({
          type: 'updateState',
          state: {
            list: data.list,
          },
        });
      } catch (e) {
        console.error(e);
      }
    },
  },
};
