<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="depts-container">
        <tree-tools :tree-node="companyInfo" is-root @add-dept="onAddDept" />
        <hr>
        <el-tree v-loading="isLoading" :data="departs" :props="defaultProps" default-expand-all node-key="id">
          <template v-slot="{data}">
            <tree-tools :tree-node="data" @del-dept="onDeiDep" @add-dept="onAddDept" @edit-dept="onEditDept" />
          </template>
        </el-tree>
      </el-card>

      <DertDialog ref="deptDailogRef" :is-show.sync="isShow" :del-id="delId" @update-list="updateList" />
    </div>
  </div>
</template>

<script>
import TreeTools from './components/index.vue'
import { getDepartments, delDepartments } from '@/api/departments'
import { list2Tree } from '@/utils/index'
import DertDialog from './components/dept-dialog.vue'
export default {
  name: 'DepartMent',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    TreeTools,
    DertDialog
  },
  data() {
    return {
      departs: [],
      companyInfo: {
        name: '',
        manager: '负责人'
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      delId: '',
      isShow: false,
      isLoading: true
    }
  },
  mounted() {
    this.loadDeptsList()
  },
  methods: {
    async loadDeptsList() {
      const res = await getDepartments()
      console.log(res)
      this.companyInfo.name = res.companyName
      this.departs = list2Tree(res.depts, '')
      this.isLoading = false
    },
    async onDeiDep(delId) {
      try {
        const result = await this.$confirm('要删除吗')
        if (result === 'confirm') {
          await delDepartments(delId)
          this.loadDeptsList()
        }
      } catch (error) {
        console.log('出错了')
      }
    },
    onAddDept(delId) {
      this.delId = delId
      console.log(delId)
      this.isShow = true
    },
    async onEditDept(id) {
      this.delId = id
      await this.$refs.deptDailogRef.getDetail(id)
      this.isShow = true
    },
    updateList() {
      this.loadDeptsList()
    }
  }
}
</script>
<style lang="scss" scoped>
.depts-container {
  padding: 30px 50px;
  .manage-text {
    margin-right: 20px;
    font-size: 16px;
  }

  .el-dropdown {
    color: #333;
    font-size: 16px !important;
  }

  .tree-item {
    width: 100%;
  }
}
