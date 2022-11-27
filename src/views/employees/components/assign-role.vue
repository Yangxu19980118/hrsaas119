<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <!-- 选项 -->
      <el-checkbox v-for="item in checkList" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <el-row type="flex" justify="center">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getRoleList, getUserDetailById, assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checkList: [],
      roleIds: [],
      id: ''
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      const { rows } = await getRoleList()
      console.log(rows)
      this.checkList = rows
    },
    async getUserById(id) {
      this.id = id
      //   const { roleIds } = await getUserDetailById(id)
      //   console.log(roleIds)
      //   this.roleIds = roleIds || []
      const res = await getUserDetailById(id)
      this.roleIds = res.roleIds || []
    },
    async btnOk(id) {
      await assignRoles({ id: this.id, roleIds: this.roleIds })
      console.log(this.id)
      this.$emit('update:showRoleDialog', false)
    },
    btnCancel() {
      this.roleIds = []
      this.$emit('update:showRoleDialog', false)
    }

  }
}
</script>

<style>

</style>
