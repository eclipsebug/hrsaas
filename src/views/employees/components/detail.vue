<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form label-width="120px" ref="formRef" :model="formData" :rules="rules" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="姓名:" prop="username">
                <el-input style="width:300px" v-model="formData.username"/>
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input style="width:300px" type="password" v-model="formData.password2"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="upDateUserInfo">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 放置个人详情 -->
            <component :is="UserInfo"/>
            <!-- <user-info /> -->
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <component :is="JobInfo"/>

          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>


import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import { Message } from 'element-ui'
import UserInfo from '@/views/employees/components/user-info'
import JobInfo from '@/views/employees/components/job-info'

export default {
  // import 引入的组件需要注入到对象中才能使用

  components: {
    UserInfo,
    JobInfo
  },
  props: {},
  data() {

    // 这里存放数据
    return {
      UserInfo: UserInfo,
      JobInfo: JobInfo,
      formData: {
        username: '',
        password2: ''
      },
      //校验
      rules: {
        username: [
          {
            required: true,
            message: ('请输入姓名'),
            trigger: 'blur'

          }
        ],
        password2: [
          {
            required: true,
            message: ('请输入密码')
          },
          {
            min: 6,
            max: 16,
            message: ('密码长度在6-16位'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  // 计算属性 类似于 data 概念
  computed: {},
  // 监控 data 中的数据变化
  watch: {},
  // 方法集合
  methods: {
    async getUserDetailById() {
      this.formData = await getUserDetailById(this.$route.params.id)
    },
    async upDateUserInfo() {
      await this.$refs.formRef.validate()
      try {

        await saveUserDetailById({
          ...this.formData,
          password: this.formData.password2
        })
        Message.success('用户信息更新成功')

      } catch (e) {
        Message.error(e.message || '更新失败')

      }
    }
  },
  // 生命周期 - 创建完成（可以访问当前this 实例）
  created() {
    this.getUserDetailById()
  }

}
</script>

<style scoped>
</style>
