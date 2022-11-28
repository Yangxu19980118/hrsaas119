import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUplad from './ImageUpload'
import Workcalendar from '../views/dashboard/components/work-calendar.vue'
import ScreenFull from './ScreenFull'
import ThemePicker from '../views/dashboard/components/ThemePicker.vue'
import lang from './lang/index.vue'
export default {
  install(Vue) {
    Vue.component(PageTools.name, PageTools)
    Vue.component(UploadExcel.name, UploadExcel)
    Vue.component(ImageUplad.name, ImageUplad)
    Vue.component(Workcalendar.name, Workcalendar)
    Vue.component(ScreenFull.name, ScreenFull)
    Vue.component('ThemePicker', ThemePicker)
    Vue.component('lang', lang)
  }
}
