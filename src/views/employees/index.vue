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
          <el-button size="mini" type="warning" @click="showDialog=true">新增员工</el-button>
        </template>
      </tool-bar>
      <el-table
        border
        :data="list"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="序号"
        />
        <el-table-column
          prop="username"
          label="姓名"
          width="180"
        />
        <el-table-column
          prop="workNumber"
          label="工号"
        />
        <el-table-column
          prop="formOfEmployment"
          label="聘用形式"
          :formatter="formatter"
        />
        <el-table-column
          prop="departmentName"
          label="部门名称"
        />
        <el-table-column
          label="入职时间"
          sortable=""
          align="center"
        >
          <template slot-scope="{row}">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" align="center" sortable="" prop="enableState">
          <template slot-scope="{ row }">
            <!-- 根据当前状态来确定 是否打开开关 -->
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template slot-scope="{ row }">
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="margin-top:20px " type="flex" justify="center">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-sizes="[1, 5, 10, 20]"
          :current-page.sync="page.page"
          @current-change="changeCurrent"
          @size-change="SizeChange"
        />
      </el-row>
    </div>
    <AddEmployee :is-show-dialog.sync="showDialog" />
  </div>
</template>

<script>

import { delEmployee, getEmployeeList } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import { Message } from 'element-ui'
import AddEmployee from '@/views/employees/components/add-employee'

export default {
  components: { AddEmployee },
  data() {
    return {
      showDialog: false,
      list: [],
      page: {
        page: 1, // 当前页码
        size: 10
      },
      total: 0 // 总数
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.page)
      this.list = rows
      this.total = total
    },
    changeCurrent(page) {
      this.page.page = page
      this.getEmployeeList()
    },
    SizeChange(size) {
      console.log(size)
      this.page.size = size
      this.getEmployeeList()
    },
    // 员工状态
    formatter(row, column, cellValue) {
      const currentData = EmployeeEnum.hireType.find(item => item.id === cellValue)?.value
      return currentData || '未知'
    },
    //  删除员工
    async deleteEmployee(id) {
      await this.$confirm('您确定删除该员工吗')
      await delEmployee(id)
      Message.success('删除成功')
      await this.getEmployeeList()
    }
  }
}
</script>

<style>

</style>
