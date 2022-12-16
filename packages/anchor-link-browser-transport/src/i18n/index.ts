import en from './en_US/index.json'
import zh from './zh_CN/index.json'

export default class Intl {
    locale: any
    constructor(currentLocale) {
        const locales = {
            'zh-cn': zh,
            'en-us': en,
        }
        this.locale = locales[currentLocale] || {}
    }

    get(key: string, variables?: object) {
        const value = this.locale[key]
        if (value) {
            if (variables) {
                return value.replace(/\{(.*?)\}/, (_, $1) => variables[$1] || '')
            } else {
                return value
            }
        }
        return ''
    }
}
