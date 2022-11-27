<template>
  <el-dialog :title="`${getTitle()}角色`" width="40%" :visible="isVisible" @close="onClosed">
    <el-form ref="roleFormRef" :model="roleForm" :rules="roleFormRules">
      <el-form-item label="角色名称" prop="name" label-width="120px">
        <el-input v-model="roleForm.name" />
      </el-form-item>
      <el-form-item label="角色描述" label-width="120px">
        <el-input v-model="roleForm.description" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button size="small" type="info" icon="el-icon-refresh-left" @click="onClosed">取消</el-button>
      <el-button size="small" type="primary" icon="el-icon-thumb" @click="onConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { addRole, getRoleDetail, updateRole } from '@/api/departments'
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleForm: {
        name: '',
        description: ''
      },
      roleFormRules: {
        name: [
          {
            required: true, message: '角色不能为空', trigger: 'blur'
          },
          {
            min: 2, max: 10, message: '应该在2-10字符之间', trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async onConfirm() {
      try {
        await this.$refs.roleFormRef.validate()
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          await addRole(this.roleForm)
        }
        this.$message.success(`${this.roleForm.id ? '编辑' : '添加'}角色成功`)
        this.onClosed()
        this.$emit('update-list')
      } catch (error) {
        console.log('验证未通过')
      }
    },
    async getDetail(id) {
      this.roleForm = await getRoleDetail(id)
    },
    getTitle() {
      return this.roleForm.id ? '编辑' : '添加'
    },
    onClosed() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$emit('update:isVisible', false)
      this.$refs.roleFormRef.resetFields()
    }
  }
}
</script>

<style>

</style>
