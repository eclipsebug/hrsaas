<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="close">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="form" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input style="width:80%" placeholder="1-50个字符" v-model="formData.name"/>
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input style="width:80%" placeholder="1-50个字符" v-model="formData.code"/>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <template>
          <el-select v-model="formData.manager" placeholder="请选择" @focus="getSimpleEmp">
            <el-option
                v-for="item in options"
                :key="item.value"
                :value="item.username"
            >
            </el-option>
          </el-select>
        </template>

      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" v-model="formData.introduce"/>
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="submit">确定</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { addDepartments, getDepartDetail, getDepartments, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
import { Message } from 'element-ui'

export default {
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  name: 'AddDept',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
// 现在定义一个函数 这个函数的目的是 去找 同级部门下 是否有重复的部门名称
    const checkName = async(rules, value) => {
      // 1、 接口获取所有的部门
      const { depts } = await getDepartments()

      //2.找出当前点击部门的子部门数据有什么特点？ pid=当前点击部门的id
      //编辑场景 >> 需要把自己过滤掉之后再去判断
      let currentChildren = null

      if (this.formData.id) {
        //当前节点的兄弟节点 &&不包括自己
        currentChildren = depts.filter(item => {
          //把自己过滤掉并且    不能和当前的节点不能和其他的节点相同
          return item.pid === this.treeNode.pid && item.id !== this.treeNode.id
        })
      } else {
        currentChildren = depts.filter(item => {
          return item.pid === this.treeNode.id
        })
      }
      // 2、找到当前点击的部门的所有子部门
      // 3、判断当前部门的所有子部门名称是否包含用户输入的部门名称
      const isRepeat = currentChildren.some(item => item.name === value)
      // 4、如果包含说明名称重复
      if (isRepeat) {
        return Promise.reject(new Error('部门名称重复'))
      }
      // --> 核心逻辑：用户输入的部门名称跟当前点击的部门的所有的子部门的名称不能重复
    }
    const checkCode = async(rules, value) => {
      // 1、 接口获取所有的部门
      const { depts } = await getDepartments()

      //  2、直接判断当前用户添写的code是否包含在已存在的数据里面
      let isRepeat = null

      //如果id存在 编辑 不存在 添加
      if (this.formData.id) {
        isRepeat = depts.some(item => item.code === value && item.id !== this.treeNode.id)
      } else {
        //
        isRepeat = depts.some(item => (item.code === value))

      }
      if (isRepeat) {
        return Promise.reject('部门code重复')
      }
      // --> 核心逻辑：用户输入的部门code跟任何部门的code都不能重复
    }

    return {
      options: [],
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 定义校验规则
      rules: {
        name: [
          {
            required: true, message: '部门名称不能为空', trigger: 'blur'
          },
          {
            min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur'
          },
          {
            validator: checkName,
            trigger: 'blur'
          }
        ],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur'
          },
          {
            validator: checkCode,
            trigger: 'blur'
          }
        ],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      }
    }
  },
  methods: {
    addDepts(node) {
      this.showDialog = true // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node
    },
    // 获取部门详情  add-dept.vue组件内部
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    },
    //提交
    async submit() {
      //根据id判断是新增还是编辑
      if (this.formData.id) {
        await updateDepartments(this.formData)

      } else {
        await this.$refs.form.validate()
        await addDepartments({
          ...this.formData,
          pid: this.treeNode.id
        })
      }
      Message.success(`${this.showTitle}成功`)
      this.$emit('getDepartments')
      this.close()
    },
    async getSimpleEmp() {
      this.options = await getEmployeeSimple()
    },
    close() {
      this.$refs.form.resetFields()
      this.$emit('update:showDialog', false)
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
