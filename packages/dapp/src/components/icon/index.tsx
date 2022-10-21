import React from 'react';
import styles from './index.scss';
import icons from '@/assets/iconfont/iconfont.css';

require(`@/assets/svgs`);

interface Icon {
  props: {
    onClick?: () => void;
    className?: string;
    type?: string;
    style?: object;
  };
}

class Icon extends React.Component {
  render() {
    const { className, onClick, type, style, ...restProps } = this.props;
    const classNames: string[] = [];
    if (className) {
      classNames.push(icons[className]);
      if (!type) {
        classNames.push(styles.icon, icons.iconfont);
      }
    }
    if (type) {
      classNames.push(styles.svgicon, `svg-icon-${type}`);
    }

    return type ? (
      <svg className={classNames.join(' ')} {...restProps} style={style}>
        <use xlinkHref={`#icon-${type}`} />
      </svg>
    ) : (
      <i onClick={onClick} className={classNames.join(' ')} />
    );
  }
}
export default Icon;
