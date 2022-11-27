<template>
  <el-dialog title="添加员工" :visible="value" width="35%" @close="onClose">
    <el-form ref="employeeFormRef" label-width="90px" :model="formData" :rules="employeeFormRules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="formData.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" type="date" placeholder="请输入入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment">
          <el-option v-for="hire in hirType" :key="hire.id" :label="hire.value" :value="hire.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-cascader
          v-model="deptNames"
          placeholder="请选择部门"
          :options="depts"
          :props="{label:'name',value:'name',checkStrictly:true}"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-input v-model="formData.correctionTime" type="date" placeholder="请输入转正时间" />
      </el-form-item>
    </el-form>

    <template v-slot:footer>
      <el-button type="info" size="small" @click="onClose">取消</el-button>
      <el-button type="primary" size="small" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import HireType from '@/api/constant/employees'
import { getDepartments } from '@/api/departments'
import { list2Tree } from '@/utils/index'
import { addEmployee } from '@/api/employees'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hirType: HireType.hireType,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      deptNames: [],
      depts: [],
      employeeFormRules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }
        ],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }],
        correctionTime: [{ required: true, message: '转正时间不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.loadDepts()
  },
  methods: {
    async loadDepts() {
      const res = await getDepartments()
      this.depts = list2Tree(res.depts, '')
    },
    onClose() {
      this.deptNames = []
      this.$emit('input', false)
      this.$refs.employeeFormRef.resetFields()
    },
    handleChange(value) {
      this.formData.departmentName = value[value.length - 1]
    },
    async confirm() {
      try {
        await this.$refs.employeeFormRef.validate()
        await addEmployee(this.formData)
        this.$message.success('添加成功')
        this.onClose()
        this.$emit('update-list')
      } catch (error) {
        console.log('校验不通过')
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.el-form {
    .el-date-editor.el-input, .el-select{
        width: 100%;
    }
}
</style>
