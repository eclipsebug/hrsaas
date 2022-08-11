import ToolBar from '@/components/ToolBar/index.vue'

//公共组件
// import PageTools from './PageTools'
import uploadExcel from '@/components/UploadExcel'
import ImageUpload from '@/components/ImageUpload'
import ScreenFull from '@/components/ScreenFull'
import ThemePicker from '@/components/ThemePicker'

export default {
	install(Vue) {
		// Vue.component('PageTools', PageTools) // 注册工具栏组件
		Vue.component('UploadExcel', uploadExcel) // 注册导入excel组件
		//第一个参数 >>组件名称 string，第二个参数的组件的配置对象
		Vue.component(ImageUpload.name, ImageUpload)
		Vue.component(ScreenFull.name, ScreenFull)
		Vue.component(ToolBar.name, ToolBar)
		Vue.constructor(ThemePicker.name, ThemePicker)
	}
}
