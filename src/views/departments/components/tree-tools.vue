<template>
  <el-row type="flex" justify="space-between" style="width: 100%">
    <el-col :span="16">
      <span>{{ treeData.name }}</span>
    </el-col>
    <el-row type="flex" justify="space-between">
      <el-col style="margin-right: 50px">
        <span>{{ treeData.manager }}</span>
        <el-dropdown @command="clickItem">
          <span class="el-dropdown-link" style="margin-left: 60px">
            操作<i class="el-icon-arrow-down el-icon--right"/>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="add">添加部门</el-dropdown-item>
            <el-dropdown-item v-if="isRoot" command="edit">编辑部门</el-dropdown-item>
            <el-dropdown-item v-if="isRoot" command="del">删除部门</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>

import { delDepartments } from '@/api/departments'

export default {
  props: {
    treeData: {
      require: true,
      type: Object
    },
    isRoot: {
      type: Boolean,
      default: false
    }

  },
  methods: {
    async clickItem(type) {
      // 判断点击的删除按钮
      if (type === 'add') {
        // 添加逻辑
        console.log('add')
        this.$emit('addDepts', this.treeData)
        this.$emit('getDepartments', this.treeData)
        this.$emit('handleAddItem', this.treeData)
      } else if (type === 'edit') {
        console.log('点击了编辑')
        this.$emit('handleEditDepts', this.treeData)
      } else {
        // 删除逻辑
        await this.$confirm('确认退出?')
        await delDepartments(this.treeData.id)
        // 删除成功
        this.$message.success('删除成功')
        this.$emit('delDepts')
      }
    }

  }
}
</script>
