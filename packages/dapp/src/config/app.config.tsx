import React from 'react';
import {
  AppOutline,
  MessageOutline,
  MessageFill,
  UnorderedListOutline,
  UserOutline,
} from 'antd-mobile-icons';

export const footer = [
  {
    key: 'home',
    title: '首页',
    icon: <AppOutline />,
  },
  {
    key: 'todo',
    title: '我的待办',
    icon: <UnorderedListOutline />,
  },
  {
    key: 'message',
    title: '我的消息',
    icon: (active: boolean) => (active ? <MessageFill /> : <MessageOutline />),
  },
  {
    key: 'personalCenter',
    title: '个人中心',
    icon: <UserOutline />,
  },
];
