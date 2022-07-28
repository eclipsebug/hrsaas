<template>
  <div class="dashboard-container" v-loading="loadingshow">
    <div class="app-container">
      <el-card>

        <tree-tool :tree-data="company" @handleAddItem="handleAddItem"></tree-tool>
      </el-card>
      <el-tree default-expand-all :data="departs" :props="defaultProps">
        <template v-slot="{data}">
          <tree-tool
              :tree-data="data"
              @handleEditDepts="handleEditDepts"
              :is-root="true"
              @getDepartments="getDepartments"
              @addDepts="addDepts"
              @delDepts="getDepartments"
          ></tree-tool>
        </template>
      </el-tree>
    </div>
    <!-- 放置新增弹层组件  -->
    <add-dept
        @getDepartments="getDepartments"
        ref="addDept"
        :show-dialog.sync="showDialog" :tree-node="node"
    />
  </div>
</template>

<script>

import TreeTool from '@/views/departments/components/tree-tools'

import { getDepartments } from '@/api/departments'
// import { tranListToTreeData, transListNew } from '@/utils'
import { transListNew } from '@/utils'
import AddDept from './components/add-dept' // 引入新增部门组件
export default {

  created() {
    this.getDepartments()
  },
  components: { TreeTool, AddDept },
  data() {
    return {
      loadingshow: false,
      node: '',
      showDialog: false, // 显示窗体
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
    addDepts(node) {
      console.log(node)
      this.showDialog = true // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node
    },
    handleEditDepts(node) {
      this.showDialog = true // 显示弹层
      this.node = node
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      console.log(this.$refs.addDept.getDepartDetail(node.id))
      this.$refs.addDept.getDepartDetail(node.id)

    },
    async getDepartments() {
      this.loadingshow = true
      try {
        const res = await getDepartments()
        this.company = {
          name: res.companyName,
          manager: '负责人' || res.companyManage,
          id: ' '
        }
        this.departs = transListNew(res.depts);
      } catch (e) {
        this.loadingshow = false

      }
      this.loadingshow = false

    },
    async handleAddItem() {
      console.log(node)
      this.showDialog = true // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node
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
