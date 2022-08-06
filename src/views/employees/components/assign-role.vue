<template>
  <el-dialog title="分配角色" :visible="showDialog" @close="close">
    <!-- 分配角色 -->
    <el-checkbox-group v-model="roleIds">
      <!--   :label="item.id"绑定的id    -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{
          item.name
        }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="12">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getRoleList } from '@/api/settings'
import { assignRoles, getUserDetailById } from '@/api/user'

export default {
  name: 'AssignRole',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      roleIds: [], //所有角色
      list: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    //关闭弹层
    close() {
      this.$emit('update:show-dialog', false)
    },
    //获取所有角色
    async getRoleList() {
      const { rows } = await getRoleList()
      this.list = rows
    },
    //获取当前的角色列表
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds // 赋值本用户的角色
    },
    //编辑完成后确定按钮
    async btnOk() {
      try {
        await assignRoles({
          id: this.currentId,
          roles: this.roleIds
        })
        this.$message.success('分配角色成功')
      } catch (e) {
        this.$message.error('分配角色失败')

      }
      this.close()
    }
  }
}
</script>
