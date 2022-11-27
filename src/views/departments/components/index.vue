<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width: 100%">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown @command="operateDepts">
            <span>操作
              <i class="el-icon-arrow-down" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子组件</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除子组件</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑子组件</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    treeNode: {
      type: Object,
      default: () => {}
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    operateDepts(command) {
      // switch (command) {
      //   case 'add':
      //     this.$emit('add-dept', this.treeNode.id)
      //     break
      //   case 'edit':
      //     this.$emit('edit-dept', this.treeNode.id)
      //     break
      //   case 'del':
      //     this.$emit('del-dept', this.treeNode.id)
      //     break
      // }
      this.$emit(`${command}-dept`, this.treeNode.id)
    }
  }
}
</script>

<style>

</style>
