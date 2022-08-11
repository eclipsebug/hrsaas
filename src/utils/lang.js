import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import Cookie from 'js-cookie'
import localEn from './en'
import localZh from './zh'

Vue.use(VueI18n)

const messages = {
	en: {
		// message: 'hello',
		...enLocale, // 或者用 Object.assign({ message: 'hello' }, enLocale)
		...localEn
	},
	zh: {
		// message: '你好',
		...zhLocale, // 或者用 Object.assign({ message: '你好' }, zhLocale)
		...localZh
	}
}
// Create VueI18n instance with options
const i18n = new VueI18n({
	locale: Cookie.get('language') || 'zh', // set locale
	messages // set locale messages
})

export default i18n
