import React from 'react';
import { Badge, TabBar } from 'antd-mobile';
import { footer } from '@/config/app.config';

import styles from './index.scss';

function Footer(props) {
  return (
    <TabBar className={styles.footer}>
      {footer.map(item => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  );
}

export default Footer;
