import React from 'react';
import Loading from '@/components/loading';
import styles from './index.scss';

export default class Button extends React.Component {
  render() {
    const {
      children,
      className,
      onClick,
      loading = false,
      disabled = false,
      type,
      size,
    } = this.props;
    const classNames = [styles.button];
    if (className) {
      classNames.push(className);
    }
    if (loading) {
      classNames.push(styles.loading);
    }
    if (disabled) {
      classNames.push(styles.disabled);
    }
    if (type) {
      classNames.push(styles[type]);
    }
    if (size) {
      classNames.push(styles[size]);
    }

    return (
      <div onClick={onClick} className={classNames.join(' ')} tabIndex="1">
        {loading ? (
          <Loading color={type === 'primary' ? 'white' : ''} />
        ) : (
          children
        )}
      </div>
    );
  }
}
