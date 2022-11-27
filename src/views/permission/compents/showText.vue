<template>
  <!-- 放置一个弹层 用来编辑新增节点 -->
  <el-dialog :title="title" :visible="showDialog" @close="undrupin">
    <!-- 表单 -->
    <el-form ref="showTextRef" label-width="120px" :model="formdata" :rules="rules">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="formdata.name" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model="formdata.code" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限描述" prop="description">
        <el-input v-model="formdata.description" style="width:90%" />
      </el-form-item>
      <el-form-item label="开启">
        <el-switch
          v-model="formdata.enVisible"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="onkendel">确定</el-button>
        <el-button size="small" @click="undrupin">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { updatePermission, addPermission, getPermissionDetail } from '@/api/permisson'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 1
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formdata: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    title() {
      return this.formdata.id ? '编辑' : '添加'
    }
  },
  methods: {
    undrupin() {
      // 移除校验规则
      this.$refs.showTextRef.resetFields()
      // 数据为空
      this.formdata = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$emit('update:showDialog', false)
    },
    async onkendel() {
      if (this.formdata.id) {
        this.$refs.showTextRef.validate()
        await updatePermission(this.formdata)
        this.$message.success('修改成功')
      } else {
        const Pargeid = {
          ...this.formdata,
          ...{ pid: this.id, type: this.type }
        }
        await addPermission(Pargeid)
        this.$message.success('添加成功')
      }
      // 关闭弹窗
      this.undrupin()
      // 通知父组件刷新 type id
      this.$emit('update-list')
    },
    async getDail(id) {
      this.formdata = await getPermissionDetail(id)
    }
  }

}
</script>

<style>

</style>
