<template>
  <div>
    <upload-excel :on-success="onSuccess" />
  </div>
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  name: 'ImportPage',
  data() {
    return {
      abc: 123
    }
  },
  methods: {
    async onSuccess({ header, results }) {
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName',
        '聘用形式': 'formOfEmployment'
      }

      const needResolveFields = ['timeOfEntry', 'correctionTime']
      const data = results.map(item => {
        const userInfo = {}
        Object.keys(item).forEach(key => {
          if (needResolveFields.includes(userRelations[key])) {
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
          } else {
            userInfo[userRelations[key]] = item[key]
          }
        })
        return userInfo
      })
      try {
        debugger
        await importEmployee(data)
        this.$message.success('导入成功')
        this.$router.go(-1)
      } catch (error) {
        this.$message.error('导入失败')
      }
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70) // 往前推了 70 年
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
