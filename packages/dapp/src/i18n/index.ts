import intl from 'react-intl-universal';
import localStorage from '@/utils/localStorage';
import en from './en-us';
import zh from './zh-cn';

/**
 * 国际化
 */
let currentLocale: string = intl.determineLocale({
  urlLocaleKey: 'lang',
  localStorageLocaleKey: 'lang',
});

// 浏览默认语言映射成合法的格式
// 只支持两种语言
currentLocale =
  {
    'zh-cn': 'zh-cn',
    'en-us': 'en-us',
  }[currentLocale.toLocaleLowerCase()] || currentLocale;

// 如果没映射到，默认为英文
if (!currentLocale) {
  currentLocale = 'en-us';
}

// 过滤，如果不在两种语言里，强制转换为英文
if (!['zh-cn', 'en-us'].includes(currentLocale)) {
  currentLocale = 'en-us';
}
// 存入storage初始化
localStorage.set('lang', currentLocale);

intl.init({
  currentLocale,
  locales: {
    [currentLocale]: {
      'zh-cn': zh,
      'en-us': en,
    }[currentLocale],
  },
});
