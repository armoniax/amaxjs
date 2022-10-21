import React from 'react';
import intl from 'react-intl-universal';
import Button from '@/components/button';
import Icon from '@/components/icon';
import localStorage from '@/utils/localStorage';
import styles from './index.scss';

function Page(props) {
  function doChangeLang(lang) {
    localStorage.set('lang', lang);
    window.location.reload();
  }
  return (
    <div className={styles.home}>
      <Button className={styles.btn}>按钮</Button>
      <Button className={styles.btn} disabled>
        按钮 disabled
      </Button>
      <div className="sm-4">国际化：{intl.get('home')}</div>
      <Button className={styles.btn} onClick={() => doChangeLang('en-us')}>
        英文
      </Button>
      <Button className={styles.btn} onClick={() => doChangeLang('zh-cn')}>
        中文
      </Button>
      <Button className={styles.btn}>
        iconfont:
        <Icon className="icon-Heart" />
      </Button>
      <Button className={styles.btn}>
        svg:
        <Icon type="test" />
      </Button>
      <Button className={styles.btn}>环境变量：{process.env.BUILD_ENV}</Button>
    </div>
  );
}
export default React.memo(Page);
