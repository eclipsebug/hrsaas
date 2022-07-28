<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <template>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="角色管理" name="first">

              <el-button size="small" type="primary" icon="el-icon-plus" @click="showDialog=true">新增角色</el-button>


              <el-table
                  border
                  :data="list"
                  highlight-current-row
                  style="width: 100%;   margin-top:20px "
              >
                <el-table-column
                    label="序号"

                    type="index"
                    width="50"
                >
                </el-table-column>

                <el-table-column
                    property="name"
                    label="角色描述"
                    width="120"
                >
                </el-table-column>
                <el-table-column
                    property="description"
                    label="描述"
                >
                </el-table-column>
                <el-table-column
                    property="111"
                    label="操作"
                >
                  <template v-slot="{row}">
                    <el-button size="small" type="success">分配权限</el-button>
                    <el-button size="small" type="primary" @click="edit(row.id)">编辑</el-button>
                    <el-button size="small" type="danger" @click="del(row.id)">删除</el-button>

                  </template>
                </el-table-column>
              </el-table>
              <el-row style="margin-top:20px " type="flex" justify="center">
                <el-pagination
                    background
                    layout="total,prev, pager, next"
                    :total="total"
                    :page-size="page.pagesize"
                    :current-page="page.page"
                    @current-change="changeCurrent"
                >
                </el-pagination>
              </el-row>

            </el-tab-pane>
            <el-tab-pane label="公司设置" name="second">

              <el-alert
                  title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
                  show-icon
                  type="info"
              >
              </el-alert>

              <el-form>
                <el-form-item disabled label="公司名称" label-width="102px" style="margin-top: 50px">
                  <el-input :disabled="true" style="width: 50%" v-model="fromData.name"></el-input>
                </el-form-item>
                <el-form-item disabled label="公司地址" label-width="102px">
                  <el-input :disabled="true" style="width: 50%" v-model="fromData.companyAddress"></el-input>
                </el-form-item>
                <el-form-item disabled label="邮箱" label-width="102px">
                  <el-input :disabled="true" style="width: 50%" v-model="fromData.mailbox"></el-input>
                </el-form-item>
                <el-form-item disabled label="备注" label-width="102px">
                  <el-input type="textarea"
                            v-model="fromData.remarks"
                            :autosize="{ minRows: 2, maxRows: 4}" style="width: 50%" :disabled="true"
                  >
                  </el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>

          </el-tabs>
        </template>
      </el-card>
    </div>

    <el-dialog :title="`${roleFormData.id ? '编辑' : '新增'}`" :visible="showDialog" @close="close">
      <el-form ref="editRef" label-width="120px " :model="roleFormData" :rules="roleRule">
        <el-form-item label="角色" prop="name">
          <el-input v-model="roleFormData.name">

          </el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="roleFormData.description">

          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="btnOk">确认</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import { addRole, deleteRole, getCompanyInfo, getRoleDetail, getRoleList, updateRole } from '@/api/settings'
import { Message } from 'element-ui'

export default {
  data() {
    return {
      showDialog: false,
      roleFormData: {
        name: '',
        description: ''

      },
      roleRule: {
        name: [
          {
            required: true,
            trigger: 'blur',
            message: '必填项'
          }
        ]
      },

      activeName: 'second',
      list: [], // 承接数组
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 2
      },
      total: 0, // 记录总数
      fromData: {}
    };
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //获取列表数据
    async getRoleList() {
      const { rows, total } = await getRoleList(this.page)
      this.total = total
      this.list = rows
    },
    changeCurrent(page) {
      this.page.page = page
      this.getRoleList()

    },
    async getCompanyInfo() {
      const res = await getCompanyInfo(this.$store.getters.companyId)
      this.fromData = res
    },

    //编辑
    async edit(id) {
      this.showDialog = true
      // console.log(id)
      const data = await getRoleDetail(id)
      // console.log(data)
      this.roleFormData = { ...data }
    },
    close() {
      this.showDialog = false
      //  清除表单检验
      //  清空数据
      this.$refs.editRef.resetFields()
      this.roleFormData = {
        name: '',
        description: ''
      }
    },
    //确认按钮
    async btnOk() {
      await this.$refs.editRef.validate()
      //存在id是编辑
      if (this.roleFormData.id) {
        await updateRole(this.roleFormData)
      } else {
        //添加
        await addRole(this.roleFormData)
      }
      Message.success('成功')
      await this.getRoleList()
      this.close()
    },

    //  删除
    async del(id) {
      await this.$confirm('确认删除？')
      //获取当前列表的长度
      const len = this.list.length
      //有数据  并且页码大于一
      if (len === 1 && this.page.page > 1) {
        //页码减一
        this.page.page--
      }
      Message.success('删除成功!!')
      await this.getRoleList()
    }
  }
};
</script>

<style>

</style>
