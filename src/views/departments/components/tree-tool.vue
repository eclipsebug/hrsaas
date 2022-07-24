<template>
  <el-row type="flex" justify="space-between" style="width: 100%">
    <el-col :span="16">
      <span>{{ treeData.name }}</span>
    </el-col>
    <el-row type="flex" justify="space-between">
      <el-col style="margin-right: 50px">
        <span>{{ treeData.manager }}</span>
        <el-dropdown>
  <span class="el-dropdown-link" style="margin-left: 60px">
    操作<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>添加部门</el-dropdown-item>
            <el-dropdown-item v-if="isRoot">编辑部门</el-dropdown-item>
            <el-dropdown-item v-if="isRoot">删除部门</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
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
  }
}
</script>
