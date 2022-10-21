import React from 'react';
import { connect } from 'react-redux';
import styles from './index.scss';
import { Button, Toast } from 'antd-mobile';

function Home(props) {
  return (
    <div className={styles.home}>
      <Button onClick={() => Toast.show('toast')}>Toast</Button>
    </div>
  );
}
export default connect(
  ({ loading: { effects }, home: { list } }) => ({
    loading: effects['home/getList'],
    list,
  }),
  (dispatch: any) => ({
    getList() {
      dispatch({ type: 'home/getList' });
    },
  }),
)(React.memo(Home));
