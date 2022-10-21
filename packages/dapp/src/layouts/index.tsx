import React from 'react';
import Footer from './components/footer';
import styles from './index.scss';

function BasicLayout(props) {
  return (
    <>
      <div className={styles.content}>{props.children}</div>
      <Footer />
    </>
  );
}

export default BasicLayout;
