<template>
  <el-dialog :title="`${title}子部门`" :visible="isShow" width="30%" :before-close="onClose">
    <el-form ref="deptFormRef" :model="deptForm" :rules="deptFormRules" label-width="110px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="deptForm.name" placeholder="请输入部门名称" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="deptForm.code" placeholder="请输入部门编码" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="deptForm.manager" placeholder="请选择部门负责人" @focus="onFocus">
          <el-option v-for="simple in simpleteList" :key="simple.id" :label="simple.username" :value="simple.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="deptForm.introduce" type="textarea" placeholder="请输入部门介绍" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="info" size="small" @click="onClose">取消</el-button>
      <el-button type="primary" size="small" @click="onConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getEmployeeSimple, getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
export default {
  props: {
    isShow: Boolean,
    delId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    const checkDeptName = async(rule, value, cb) => {
      const { depts } = await getDepartments()
      // eslint-disable-next-line no-return-assign
      let isRepeat
      if (this.deptForm.id) {
        isRepeat = depts.filter(dept => this.deptForm.pid === dept.pid && this.deptForm.id !== dept.id).some(item => item.name === value)
      } else {
        isRepeat = depts.filter(dept => this.delId === dept.pid).some(item => item.name === value)
      }
      isRepeat ? cb(new Error(`同级部门已经存在${value}名称了`)) : cb()
    }
    const checkDeptCode = async(rule, value, cb) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.deptForm.id) {
        isRepeat = depts.filter(dept => dept.id !== this.deptForm.id).some(item => item.code === value)
      } else {
        isRepeat = depts.some(item => item.code === value)
      }
      isRepeat ? cb(new Error(`公司下已经存在${value}名称了`)) : cb()
    }
    return {
      deptForm: {
        name: '',
        code: '',
        manager: '',
        introduce: '',
        pid: ''
      },
      simpleteList: [],
      deptFormRules: {
        name: [
          {
            required: true, message: '部门不能为空', trigger: 'blur'
          },
          {
            min: 3, max: 6, message: '部门应该在3-6个字符串之间', trigger: 'blur'
          },
          {
            validator: checkDeptName, trigger: 'blur'
          }
        ],
        code: [
          {
            required: true, message: '部门不能为空', trigger: 'blur'
          },
          {
            min: 3, max: 8, message: '部门应该在3-8个字符串之间', trigger: 'blur'
          },
          {
            validator: checkDeptCode, trigger: 'blur'
          }
        ],
        manager: [
          {
            required: true, message: '部门不能为空', trigger: 'blur'
          }
        ],
        introduce: [
          {
            required: true, message: '部门不能为空', trigger: 'blur'
          },
          {
            min: 1, max: 100, message: '部门应该在1-100个字符串之间', trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    title() {
      return this.deptForm.id ? '编辑' : '添加'
    }
  },
  methods: {
    async onFocus() {
    //   const res = await getEmployeeSimple()
    //   console.log(res)
      this.simpleteList = await getEmployeeSimple()
    },
    async onConfirm() {
      try {
        if (this.deptForm.id) {
          await this.$refs.deptFormRef.validate()
          await updateDepartments(this.deptForm)
        } else {
          await this.$refs.deptFormRef.validate()
          this.deptForm.pid = this.delId
          await addDepartments(this.deptForm)
        }
        this.$message.success(`部门${this.deptForm.id ? '编辑' : '新增'} 成功`)
        this.onClose()
        this.$emit('update-list')
      } catch (error) {
        console.log('验证不通过')
      }
    },
    async getDetail(id) {
      this.deptForm = await getDepartDetail(id)
    },
    onClose() {
      console.log('onClose')
      // 需要自己手动把form 对象置空
      this.deptForm = {
        name: '',
        code: '',
        manager: '',
        introduce: '',
        pid: ''
      }
      // resetFields 只能移除表单对象上已经绑定的属性
      this.$refs.deptFormRef.resetFields()
      this.$emit('update:isShow', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog {
    .el-select {
        width: 100%;
    }
}
</style>
