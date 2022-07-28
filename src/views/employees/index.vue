<template>
  <div class="dashboard-container">
    <div class="app-container">
      <tool-bar>
        <template #before>
          <span>1000</span>
        </template>

        <template #after>
          <el-button size="mini" type="primary">导入</el-button>
          <el-button size="mini" type="danger">导出</el-button>
          <el-button size="mini" type="warning">新增员工</el-button>
        </template>
      </tool-bar>
    </div>
  </div>
</template>

<script>

export default {
  components: {}
}
</script>

<style>

</style>
