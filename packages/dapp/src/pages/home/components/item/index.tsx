import React from 'react';
import styles from './index.scss';

function Item(props) {
  const { item } = props;

  return <div className={styles.item}>{item.name}</div>;
}

export default Item;
