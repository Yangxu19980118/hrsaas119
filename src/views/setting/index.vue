<template>
  <div>
    <div>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabToggle">
        <el-tab-pane label="用户管理" name="first">
          <el-row>
            <el-button
              icon="el-icon-plus"
              size="small"
              type="primary"
              @click="isVisible = true"
            >新增角色</el-button>
          </el-row>
          <el-table border stripe :data="roleList">
            <el-table-column label="序号" width="120" type="index" />
            <el-table-column label="角色名称" width="240" prop="name" />
            <el-table-column label="描述" prop="description" />
            <el-table-column label="操作">
              <template v-slot="{row}">
                <el-button size="small" type="success" icon="el-icon-setting" @click="addRole(row.id)">分配权限</el-button>
                <el-button size="small" type="primary" icon="el-icon-edit" @click="onEditRole(row.id)">编辑</el-button>
                <el-button size="small" type="danger" icon="el-icon-delete" @click="onDelRole(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page="pageInfo.pageno"
            :page-sizes="[2, 5, 10, 20]"
            :page-size="pageInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="company">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            :closable="false"
          />
          <el-form label-width="120px">
            <el-form-item label="公司名称">
              <el-input v-model="companyInfo.name" disabled />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="companyInfo.companyAddress" disabled />
            </el-form-item>
            <el-form-item label="公司邮箱">
              <el-input v-model="companyInfo.mailbox" disabled />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="companyInfo.remarks" class="remark" type="textarea" disabled />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <rola ref="roleDailogRef" :is-visible.sync="isVisible" @update-list="loadList" />
    <Allot ref="AllotRef" :show-perm-dialog.sync="showPermDialog" />
  </div>
</template>
<script>
import { getRoleList, getCompanyInfo, deleteRole } from '@/api/setting'
import { mapGetters } from 'vuex'
import rola from './comments/rola.vue'
import Allot from '@/views/setting/comments/allot.vue'
export default {
  components: {
    rola,
    Allot
  },
  data() {
    return {
      activeName: 'first',
      pageInfo: {
        page: 1,
        pagesize: 10
      },
      isVisible: false,
      showPermDialog: false,
      total: 0,
      roleList: [],
      companyInfo: {}
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  mounted() {
    this.loadList()
  },
  methods: {
    async loadList() {
      const { rows, total } = await getRoleList(this.pageInfo)
      this.roleList = rows
      this.total = total
    },
    handleSizeChange(newSize) {
      this.pageInfo.pagesize = newSize
      this.loadList()
    },
    handleCurrentChange(newPage) {
      this.pageInfo.page = newPage
      this.loadList()
    },
    async onEditRole(id) {
      await this.$refs.roleDailogRef.getDetail(id)
      this.isVisible = true
    },
    handleTabToggle() {
      if (this.activeName === 'company') {
        if (!Object.keys(this.companyInfo).length) {
          this.loadCompanyInfo()
        }
      }
    },
    async loadCompanyInfo() {
      this.companyInfo = await getCompanyInfo(this.companyId)
    },
    async onDelRole(roleId) {
      try {
        await this.$confirm('确认要删除该角色吗')
        await deleteRole(roleId)
        this.$message.success('删除成功')
        if (this.roleList.length === 1) {
          this.pageInfo.page >= 2 ? this.pageInfo.page - 1 : this.pageInfo.pageno = 1
        }
        this.loadList()
      } catch (error) {
        this.$message.info('取消了删除')
      }
    },
    addRole(roleId) {
      this.showPermDialog = true
      this.$nextTick(async() => {
        await this.$refs.AllotRef.getDetail(roleId)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.el-row {
  margin-bottom: 20px;
  }
.el-pagination {
  margin-top: 20px;
  text-align: center;
}
.el-form {
  margin-top: 40px;
    .el-input, .remark{
      width: 500px;
    }
}
</style>
