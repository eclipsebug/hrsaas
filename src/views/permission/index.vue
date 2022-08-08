<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template #after>
          <el-button type="primary" @click="addPermission('0',1)">添加权限</el-button>
        </template>
      </ToolBar>
      <!-- 表格 -->
      <el-table border
                :data="list"
                row-key="id"
      >
        <el-table-column align="center" label="序号" prop="" type="index"/>
        <el-table-column align="center" label="名称" prop="name"/>
        <el-table-column align="center" label="标识" prop="code"/>
        <el-table-column align="center" label="描述" prop="description"/>
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <!--            type===1是为一级权限 是否站添加按钮-->
            <el-button v-if="row.type === 1" type="text" @click="addPermission(row.id, 2)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)"> 删除</el-button>
          </template>
        </el-table-column>

      </el-table>
      <!-- 放置一个弹层 用来编辑新增节点 -->
      <el-dialog :title="`${showText}权限点`" :visible="showDialog" @close="close">
        <!-- 表单 -->
        <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width:90%"/>
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" style="width:90%"/>
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" style="width:90%"/>
          </el-form-item>
          <el-form-item label="开启">

            <el-switch
                v-model="formData.enVisible"
                active-value="1"
                inactive-value="0"
            />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" type="primary" @click="btnOK">确定</el-button>
            <el-button size="small" @click="close">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { addPermission, delPermission, getPermissionDetail, getPermissionList, updatePermission } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'

export default {
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [
          {
            required: true,
            message: ('必填项')
          }
        ],
        code: [
          {
            required: true,
            message: ('必填项')
          }
        ]
      }
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    close() {
      this.showDialog = false
      this.$refs.perForm.resetFields()
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
    },
    //初始化获取所有初始数据
    async getPermissionList() {
      const res = await getPermissionList()
      console.log(res)
      this.list = tranListToTreeData(res, '0')
    },
    //依据pid和类型判断是否添加或者是编辑
    addPermission(pid, type) {
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    //编辑
    async editPermission(id) {
      console.log(1)
      // 根据获取id获取详情
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    },
    async delPermission(id) {
      await this.$confirm('是否删除？')
      await delPermission(id)
      this.$message.success('恭喜你删除成功')
      await this.getPermissionList()

    },
    //确定按钮
    async btnOK() {
      await this.$refs.perForm.validate()
      try {
        if (this.formData.id) {
          // await this.editPermission(this.formData)
          //  编辑
          await updatePermission(this.formData)
          this.$message.success('编辑成功')

        } else {
          await addPermission(this.formData)
          this.$message.success('添加成功')

        }
      } catch (e) {
        console.log(e)
        this.$message.error(this.showText + '失败')
      }

      this.close() //关闭弹层
      await this.getPermissionList() //刷新数据
    }
  }
}
</script>

<style>

</style>
