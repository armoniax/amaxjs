import React from 'react';
import styles from './index.scss';

export default class Loading extends React.Component {
  render() {
    const { text, className, color } = this.props;
    const classNames = [styles.loading];
    if (className) {
      classNames.push(className);
    }
    return (
      <div className={classNames.join(' ')}>
        <div className={styles.loader + ' ' + styles[color]}></div>
        {text ? <div className={styles.loadingText}>{text}</div> : null}
      </div>
    );
  }
}
