/**
 * 当前目录是pages，所以配置components时注意路径
 */

const routes = [
  {
    path: '/',
    component: './layouts',
    routes: [
      { exact: true, path: '/', component: './pages/home' },
      { exact: true, path: '/page', component: './pages/page' },
      {
        redirect: '/',
      },
    ],
  },
];

export default routes;
