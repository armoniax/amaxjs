import React from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from 'antd-mobile';
import styles from './index.scss';

function Header(props) {
  return (
    <header className={styles.header}>
      <Link to="/">home</Link> --------- <Link to="/page">page</Link>
    </header>
  );
}

export default Header;
