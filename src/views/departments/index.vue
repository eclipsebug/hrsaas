<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>

        <tree-tool :tree-data="company"></tree-tool>
      </el-card>
      <el-tree default-expand-all :data="departs" :props="defaultProps">
        <template v-slot="{data}">
          <tree-tool :tree-data="data" :is-root="true"></tree-tool>

        </template>
      </el-tree>
    </div>
  </div>
</template>

<script>

import TreeTool from '@/views/departments/components/tree-tool'

import { getDepartments } from '@/api/departments'
// import { tranListToTreeData, transListNew } from '@/utils'
import { transListNew } from '@/utils'

export default {

  created() {
    this.getDepartments()
  },
  components: { TreeTool },
  data() {
    return {
      defaultProps: {
        label: 'name'
      },
      departs: [
        {
          name: '总裁办', manager: '曹操',
          children: [
            {
              name: '董事会', manager: '曹丕'
            }
          ]
        },
        {
          name: '行政部', manager: '刘备'
        },
        {
          name: '人事部', manager: '孙权'
        }
      ],
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' }
    }
  },
  methods: {
    async getDepartments() {
      const res = await getDepartments()
      this.company = {
        name: res.companyName,
        manager: '负责人' || res.companyManage
      }
      // this.departs = res.depts
      // this.departs = tranListToTreeData(res.depts, '');
      this.departs = transListNew(res.depts);

      console.log(res)
    }
  }
}
</script>

<style scoped lang="scss">
.app-container {
  width: 850px;
  margin: 10px auto;
  border: 1px solid red;
}
</style>
