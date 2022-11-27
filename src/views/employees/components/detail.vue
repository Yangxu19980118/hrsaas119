<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <el-form ref="formDataRef" label-width="120px" style="margin-left: 120px; margin-top:30px" :model="formData" :rules="formDataRules">
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="formData.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="psd">
                <el-input v-model="formData.psd" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="saveUserInfo">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 放置个人详情 -->
            <component :is="userComponent" />
            <!-- <user-info /> -->
          </el-tab-pane>
          <el-tab-pane label="岗位详情">
            <!-- 放置岗位详情 -->
            <component :is="JobInfo" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from '@/api/employees'
import userComponent from './user-info.vue'
import JobInfo from './job-info.vue'
export default {
  components: {
    userComponent,
    JobInfo
  },
  props: {
    userId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formData: {},
      formDataRules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        psd: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      },
      userComponent,
      JobInfo
    }
  },
  mounted() {
    this.loadDetail()
  },
  methods: {
    async loadDetail() {
      this.formData = await getUserDetailById(this.userId)
    },
    async saveUserInfo() {
      try {
        await this.$refs.formDataRef.validate()
        console.log('校验成功')
        const newObj = Object.assign({}, this.formData, { password: this.formData.psd })
        console.log(newObj)
        await saveUserDetailById(newObj)
        this.$message.success('修改成功')
      } catch (error) {
        console.log('校验失败')
      }
    }
  }
}
</script>

<style>

</style>
