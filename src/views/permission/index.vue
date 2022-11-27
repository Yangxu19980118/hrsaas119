<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <el-card>
        <el-row>
          <el-button type="primary" size="small" @click="onAddel(1,'0')">添加权限</el-button>
        </el-row>
      </el-card>
      <!-- 表格 -->
      <el-table border stripe row-key="id" default-expand-all :data="defaultList">
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <el-button type="primary" size="mini" @click="onAddel(2,row.id)">添加</el-button>
            <el-button type="success" size="mini" @click="Bianji(row.id)">编辑</el-button>
            <el-button type="danger" size="mini" @click="onDelet(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <showText :id="id" ref="showTextRef" :show-dialog.sync="showDialog" :update-list="updateList" :type="type" />
  </div>
</template>

<script>
import { getPermissionList, delPermission } from '@/api/permisson'
import { list2Tree } from '@/utils'
import showText from '@/views/permission/compents/showText.vue'
export default {
  components: {
    showText
  },
  data() {
    return {
      defaultList: [],
      showDialog: false,
      type: 1,
      id: ''
    }
  },
  mounted() {
    this.loadList()
  },
  methods: {
    async loadList() {
      const list = await getPermissionList()
      console.log(list)
      this.defaultList = list2Tree(list, '0')
    },
    onAddel(type, id) {
      this.id = id
      this.type = type
      this.showDialog = true
    },
    updateList() {
      this.loadList()
      this.type = 1
      this.id = ''
    },
    async onDelet(id) {
      try {
        await delPermission(id)
        this.$message.success('删除成功')
        this.loadList()
      } catch (error) {
        this.$message.success('删除错误')
      }
    },
    async Bianji(id) {
      await this.$refs.showTextRef.getDail(id)
      // 弹窗
      this.showDialog = true
    }
  }
}
</script>

<style>

</style>
