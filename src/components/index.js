import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUplad from './ImageUpload'
export default {
  install(Vue) {
    Vue.component(PageTools.name, PageTools)
    Vue.component(UploadExcel.name, UploadExcel)
    Vue.component(ImageUplad.name, ImageUplad)
  }
}
