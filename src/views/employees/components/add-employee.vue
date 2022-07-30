<template>
  <el-dialog title="新增员工" :visible="isShowDialog" @close="close">
    <!-- 表单 -->
    <el-form ref="formRef" label-width="180px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:80%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:80%" placeholder="请选择">
          <el-option v-for="item in selecOptions" :key="item.id" :value="item.id" :label="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <!--        <el-input v-model="formData.departmentName" style="width:80%" placeholder="请选择部门" />-->
        <el-cascader
          v-model="formData.departmentName"
          :options="options"
          :props="{ checkStrictly: true, label: 'name', value: 'name', emitPath: false }"
          placeholder="请选择部门数据"
          @focus="getEmployeeList"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:80%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small">取消</el-button>
          <el-button type="primary" size="small" @click="isOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { transListNew } from '@/utils'
import { getDepartments } from '@/api/departments'
import EmployeeEnum from '@/api/constant/employees'
import { addEmployee } from '@/api/employees'
import { Message } from 'element-ui'

export default {
  name: 'AddEmployee',
  props: {
    isShowDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selecOptions: EmployeeEnum.hireType,
      options: [],
      formData: {
        username: '大大怪', // 用户姓名
        mobile: '13785208520', // 手机号
        formOfEmployment: 1, // 聘用形式
        workNumber: '123212', // 工号
        departmentName: '', // 部门名称
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          {
            required: true, message: '用户姓名不能为空'
          },
          {
            min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur'
          }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空' }, { trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      }
    }
  },
  created() {

  },
  methods: {
    close() {
      // 父组件 通过.sync修饰符 传递下来一个update事件 ，子组件可以修改父组件里面的值
      this.$emit('update:isShowDialog', false)
      //  重置表单
      this.$refs.formRef.resetFields()
      //  重置数据
      this.formData = {
        username: '', // 用户姓名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门名称
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      }
    },
    async getEmployeeList() {
      const { depts } = await getDepartments()
      this.options = transListNew(depts)
    },
    async isOk() {
      await this.$refs.formRef.validate()
      await addEmployee(this.formData)
      await Message.success('添加员工成功!')
      this.close()
      this.$parent.getEmployeeList()
    }
  }
}
</script>

<style>

</style>
