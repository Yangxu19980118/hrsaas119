<template>
  <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
    <!-- 权限是一颗树 -->
    <!-- 将数据绑定到组件上 -->
    <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
    <!-- id作为唯一标识 -->
    <el-tree
      ref="permTree"
      :data="permList"
      :props="defaultProps"
      :show-checkbox="true"
      :check-strictly="true"
      :default-expand-all="true"
      node-key="id"
    />
    <!-- 确定 取消 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
        <el-button size="small" @click="btnPermCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getPermissionList, getRoleDetail, assignPerm } from '@/api/setting'
import { list2Tree } from '@/utils'
export default {
  name: 'Allot',
  props: {
    showPermDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      permList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      roleId: ''
    }
  },
  mounted() {
    this.loadPerList()
  },
  methods: {
    async loadPerList() {
      const res = await getPermissionList()
      this.permList = list2Tree(res, '0')
    },
    btnPermCancel() {
      this.defaultCheckKeys = []
      this.$emit('update:showPermDialog', false)
    },
    async getDetail(id) {
      this.roleId = id
      const { permIds } = await getRoleDetail(id)
      this.$refs.permTree.setCheckedKeys(permIds)
    },
    async btnPermOK() {
      const inputParams = {
        id: this.roleId,
        permIds: this.$refs.permTree.getCheckedKeys()
      }
      try {
        await assignPerm(inputParams)
        this.$message.success('分配成功')
        this.btnPermCancel()
      } catch (error) {
        this.$message.error('权限出错')
      }
    }
  }

}
</script>

<style>

</style>
