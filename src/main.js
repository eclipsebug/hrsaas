import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Print from 'vue-print-nb'  //打印插件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
//全局注册 打印 使用 v-print
Vue.use(Print);
// 一次性注册所有指令
import * as directives from '@/directives/index'

/**
 * {
 *     imgError:{inserted() {}},
 *     focus:{inserted() {}}
 * }
 */

for (const key in directives) {
	// 注册指令
	Vue.directive(key, directives[key])
}

// import ToolBar from '@/components/ToolBar/index'
//
// Vue.use(ToolBar)

// 引入过滤器
import * as filters from '@/filters/index.js'

// 注册使用
// Object.keys(filters).forEach(key => {
//   Vue.filter(key, filters[key])
// })

for (const key in filters) {
	Vue.filter(key, filters[key])
}

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
import i18n from '@/utils/lang'

Vue.use(ElementUI, {
	i18n: (key, value) => i18n.t(key, value)
})
import TagsView from '@/components/TagsView'

Vue.component('TagsView', TagsView)
Vue.config.productionTip = false

new Vue({
	el: '#app',
	router,
	store,
	i18n,
	render: h => h(App)
})
