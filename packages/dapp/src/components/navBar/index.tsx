import React from 'react';
import { NavBar } from 'antd-mobile';
import styles from './index.scss';

function NavBarCom(props) {
  const { children, ...other } = props;
  function back() {}
  return (
    <NavBar className={styles.NavBar} onBack={back} {...other}>
      {children}
    </NavBar>
  );
}
export default NavBarCom;
