import VConsole from 'vconsole';

if (process.env.BUILD_ENV === 'development') {
  new VConsole({ theme: 'dark' });
}
