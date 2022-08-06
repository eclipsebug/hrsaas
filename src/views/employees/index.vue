<template>
  <div class="dashboard-container">
    <div class="app-container">
      <tool-bar>
        <template #before>
          <span>1000</span>
        </template>
        <template #after>
          <el-button size="mini" type="primary" @click="$router.push('/import')">导入</el-button>
          <el-button size="mini" type="danger" @click="exportToExcel">导出</el-button>
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
        <!--        头像-->
        <el-table-column
            label="头像"
        >
          <template v-slot="{row}">
            <el-row type="flex" justify="center">
              <el-avatar :src="row.staffPhoto" style="width: 80px; height: 80px;" @click.native="showQrCode(row.staffPhoto)">
                <img src="@/assets/common/bigUserHeader.png" alt="默认图片">
              </el-avatar>
            </el-row>

          </template>
        </el-table-column>
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
            <el-switch :value="row.enableState === 1"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="$router.push(`employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
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
    <AddEmployee :is-show-dialog.sync="showDialog"/>
    <el-dialog title="二维码" :visible.sync="showAvatar" @opened="showQrCode" @close="imgUrl=''">
      <el-row type="flex" justify="center">
        <canvas ref="Canvas"/>
      </el-row>
    </el-dialog>
    <AssignRole :currentId="currentId" :show-dialog.sync="showDialog2" ref="assignRoleRef"></AssignRole>
  </div>
</template>

<script>

import { formatDate } from '@/filters'

const headers = {
  '姓名': 'username',
  '手机号': 'mobile',
  '入职日期': 'timeOfEntry',
  '聘用形式': 'formOfEmployment',
  '转正日期': 'correctionTime',
  '工号': 'workNumber',
  '部门': 'departmentName'
}
import { delEmployee, getEmployeeList } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import { Message } from 'element-ui'
import AddEmployee from '@/views/employees/components/add-employee'
import * as QrCode from 'qrcode'
import AssignRole from '@/views/employees/components/assign-role'    //生成二维码插件

export default {
  components: { AssignRole, AddEmployee },
  data() {
    return {
      showDialog: false,
      showAvatar: false,
      showDialog2: false,
      currentId: null,
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
    //编辑角色
    editRole(id) {
      this.showDialog2 = true
      this.currentId = id   //传递给子组件的当前项id
      this.$refs.assignRoleRef.getUserDetailById(id)
    },
    async showQrCode(url) {
      this.showAvatar = true
      try {
        await this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.Canvas, url) // 将地址转化成二维码
        })
      } catch (e) {
        console.log(e)
      }
    },
    async exportToExcel() {
      const { export_json_to_excel } = await import(
          /*webpackChunkName:'export2Excel'*/
          '@/utils/Export2Excel')
      // const tHeadere = ['Id', '标题,', '作者', '阅读', '时间']
      const { rows } = await getEmployeeList({ page: 1, size: this.total })
      const resData = this.formatterData(rows, headers)
      export_json_to_excel({
        header: Object.keys(headers),
        // data: [['13399999', '张三', '2020-2020-2020', '2020', '79119'], ['13399999', '张三', '2020-2020-2020', '2020', '79119'], ['13399999', '张三', '2020-2020-2020', '2020', '79119'], ['13399999', '张三', '2020-2020-2020', '2020', '79119'], ['13399999', '张三', '2020-2020-2020', '2020', '79119'], ['13399999', '张三', '2020-2020-2020', '2020', '79119'], ['13399999', '张三', '2020-2020-2020', '2020', '79119']],
        data: resData,
        filename: '员工信息表',
        autoWidth: true,
        bookType: 'xlsx'
      })
    },

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
    },
    //数据转化 导出
    formatterData(rows, headers) {
      //遍历原始数据
      return rows.map(item => {
        //item>>员工对象
        //返回的值是为数组
        //顺序需要和headers的key一一对应
        //直接map>>Object.keys(headers)
        //可以拿到遍历每一项的中文的key
        //中文key>>映射表>>英文的key>通过item可以指导具体数据进行返回

        return Object.keys(headers).map(key => {
          //格式化时间
          //如果是时间 >>格式化
          if (['timeOfEntry', 'correctionTime'].includes(headers[key])) {
            return formatDate(item[headers[key]])
          }
          // 如果是聘用形式>>转化1.正式员工>>通过item可以找到具体数据进行返回
          if (headers[key] === 'formOfEmployment') {
            return EmployeeEnum.hireType.find(child => child.id === +child.id === +item[headers[key]])?.value || '未知'
          }
          return item[headers[key]]
        })
      })

    }
  }
}
</script>

<style>

</style>
