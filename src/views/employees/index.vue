<!-- eslint-disable no-unreachable -->
<!-- eslint-disable vue/valid-v-bind -->
<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools is-show-left>
        <template #left>
          共{{ total }}条数据
        </template>
        <template #right>
          <el-button v-if="checkPermission('export-user-btn')" size="small" type="danger" @click="onExcle">excel导出</el-button>
          <el-button size="small" type="success" @click="$router.push('/import')">excel导入</el-button>
          <el-button v-if="checkPermission('add-employee-btn')" size="small" type="primary" @click="isVisible = true">新增员工</el-button>
        </template>
      </PageTools>
      <el-card class="box-card">
        <el-table border stripe :data="roleList">
          <el-table-column label="序号" type="index" width="50px" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="头像" prop="staffPhoto">
            <template v-slot="{row}">
              <img v-imgerror="defaultImg" :src="row.staffPhoto" class="staffPhoto" @click="showQr(row.staffPhoto)">
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile" width="120px" />
          <el-table-column label="工号" prop="workNumber" />
          <el-table-column label="账户状态" prop="enableState">
            <template v-slot="{row}">
              <el-switch active-color="#67c23a" :value="row.enableState == 1" />
            </template>
          </el-table-column>
          <el-table-column label="聘用形式" prop="formOfEmployment">
            <template v-slot="{row}">
              {{ row.formOfEmployment | formatterHire }}
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column label="入职时间" prop="timeOfEntry">
            <template v-slot="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template v-slot="{row}">
              <el-button type="text" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text">转正</el-button>
              <el-button type="text">调岗</el-button>
              <el-button type="text">离职</el-button>
              <el-button type="text" @click="allotRole(row.id)">角色</el-button>
              <el-button type="text" @click="onDel(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="pageInfo.pageno"
          :page-sizes="[10, 30, 50, 200]"
          :page-size="pageInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-card>
      <el-dialog
        title="二维码"
        :visible="isShowQr"
        width="300px"
        @close="onCloseQr"
      >
        <el-row type="flex" justify="center">
          <canvas ref="myCanvas" />
        </el-row>
      </el-dialog>
      <AddDemployee v-model="isVisible" @update-list="loadList" />
      <RoleDialog v-if="showRoleDialog" ref="showRoleDialogRef" :show-role-dialog.sync="showRoleDialog" />
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import defaultImg from '@/assets/common/head.jpg'
import AddDemployee from '@/views/employees/components/add-employee.vue'
import employee from '@/api/constant/employees'
import QrCode from 'qrcode'
import RoleDialog from './components/assign-role.vue'
// import employee from '@/api/constant/employees'
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    AddDemployee,
    RoleDialog
  },
  data() {
    return {
      pageInfo: {
        page: 1,
        pagesize: 10
      },
      total: 0,
      roleList: [],
      defaultImg,
      isVisible: false,
      hireType: employee.hireType,
      isShowQr: false,
      showRoleDialog: false
    }
  },
  mounted() {
    this.loadList()
  },
  methods: {
    async loadList() {
      const { rows, total } = await getEmployeeList(this.pageInfo)
      rows.forEach(item => {
        item.enableState = 1
      })
      this.roleList = rows
      this.total = total
    },
    formatEmployee(row, colum, cellValue, index) {
      const hire = this.hireType.find(item => item.id === +cellValue)
      return hire ? hire['value'] : '未知'
    },
    handleSizeChange(newSize) {
      console.log(newSize)
      this.pageInfo.pagesize = newSize
      this.loadList()
    },
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.pageInfo.page = newPage
      this.loadList()
    },
    async onDel(id) {
      const res = confirm('删除吗')
      if (res) {
        try {
          await delEmployee(id)
          this.loadList()
        } catch (error) {
          this.$message.error(error.message)
        }
      }
    },
    onExcle() {
      const headers = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }

      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({ page: 1, size: this.total })
        const data = this.formateData(rows, headers)
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data: data,
          filename: '',
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    },
    formateData(list, header) {
      return list.map(item => {
        return Object.values(header).map(key => {
          if (key === 'timeOfEntry' || key === 'correctionTime') {
            return this.formateDate(item[key])
          } else if (key === 'formOfEmployment') {
            const person = this.hireType.find(x => x.id === +item[key])
            // ?? 空值运算符是一个逻辑运算符 左侧为null 或 underfind 时 ，返回右侧操作数，否则返回左侧
            return person?.value ?? '未知'
          } else {
            return item[key]
          }
        })
      })
      // eslint-disable-next-line no-unreachable, no-undef
      console.log(data)
    },
    formateDate(numb) {
      const date = new Date(numb)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1 + '').padStart(2, '0')
      const day = (date.getDate() + '').padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    showQr(url) {
      console.log(url)
      if (url) {
        this.isShowQr = true
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('更新头像')
      }
    },
    // eslint-disable-next-line vue/no-dupe-keys
    onCloseQr() {
      this.isShowQr = false
    },
    allotRole(id) {
      this.showRoleDialog = true
      this.$nextTick(async() => {
        this.$refs.showRoleDialogRef.getUserById(id)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.box-card{
  margin-top: 20px;
  .el-pagination {
    text-align: center;
  }
  .staffPhoto {
    width: 90px;
    height: 90px;
    border-radius: 50%;
  }
}

</style>
