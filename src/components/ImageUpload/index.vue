<!-- eslint-disable no-undef -->
<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :limit="1"
      :file-list="fileList"
      :on-preview="preview"
      :on-remove="Remove"
      :on-change="Change"
      :before-upload="onBeforeUpload"
      :http-request="onHttpRequest"
      :class="{
        'img-upload':fileList.length === 1
      }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-show="showPercent" style="width: 180px" :percentage="percentage" />
    <el-dialog :visible="isShow" title="预览图片" width="30%" @close="onClose">
      <img style="width:100%" :src="imgUrl">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'

const cos = new COS({
  SecretId: 'AKIDHWittkaGVhklhSzHMPKHD9xX0RxdAZyD',
  SecretKey: '5vXwLpKkw5Kfr49GF2b5NRWRH5oPp11t'
})
export default {
  name: 'ImageUpload',
  data() {
    return {
      fileList: [
        // { name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }
      ],
      isShow: false,
      imgUrl: '',
      currUid: '',
      percentage: 0,
      showPercent: false
    }
  },
  methods: {
    preview(file) {
      this.imgUrl = file.url
      this.isShow = true
    },
    Remove(file, fileList) {
      // 将fileList 置空
      // this.fileList = fileList
      this.fileList = []
    },
    Change(file, fileList) {
      console.log(file, fileList)
      // if (fileList) {
      this.fileList = fileList.map(item => item)
      // }
    },
    onBeforeUpload({ size, type, uid }) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(type)) {
        this.$message.warning(`上传的图片${type}不合法`)
        return Promise.reject('失败')
      }
      const maxSize = 5 * 1024 * 1024
      if (size > maxSize) {
        this.$message.warning(`上传图片过大`)
        return false
      }
      console.log('检查通过')
      this.currUid = uid
      return true
    },
    onHttpRequest(params) {
      console.log(params)
      this.showPercent = true
      const file = params.file
      cos.putObject({
        Bucket: 'xudada-1315200013', // 存储桶
        Region: 'ap-nanjing', // 地域
        Key: file.name, // 文件名
        StorageClass: 'STANDARD', // 此类写死
        Body: file, // 要上传的文件对象
        onProgress: (progressData) => {
          this.percentage = progressData.percent * 100
        }
      }, (err, data) => {
        console.log(err || data)
        if (!err && data?.statusCode === 200) {
          this.fileList = this.fileList.map(item => {
            if (item.uid === this.currUid) {
              return {
                url: 'https://' + data.Location,
                upload: true
              }
            }
            return item
          })
          setTimeout(() => {
            this.showPercent = false
            this.percentage = 0
          }, 1500)
        }
      })
    },
    onClose() {
      this.isShow = false
      this.imgUrl = ''
    }
  }
}
</script>
<style scoped lang='scss'>

</style>

