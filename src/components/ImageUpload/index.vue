<template>
  <div>
    <el-upload
        action="#"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :class="{completed:isCompleted}"
        :on-change="changeFile"
        :before-upload="beforeUpload"
        :http-request="upLoad"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <!--    上传进度条-->
    <el-progress :percentage="percentage" style="width: 120px" v-if=" showPercent"
    ></el-progress>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
//引入腾讯云上传 第三方包
import COS from 'cos-js-sdk-v5'
import { Message } from 'element-ui'
// 依据文档进行配置
const cos = new COS({
  SecretId: 'AKIDc3FCuMZXFk00lHXYKq79wUmqfFaDakiS',
  SecretKey: 'YqtgDVYLtBE1ZsvjHadQ0LQGqBHBpENH'
})
export default {
  name: 'ImageUpload',

  data() {
    return {
      showPercent: false,

      percentage: 0,
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [
        {
          url: 'https://img2.baidu.com/it/u=2859542338,3761174075&fm=253&fmt=auto&app=138&f=JPEG?w=501&h=500'
        }
      ]
    };
  },
  computed: {
    isCompleted() {
      return this.fileList.length === 1
    }
  },
  methods: {
    //上传文件
    changeFile(file, fileList) {
      //把当前的上传的最终的文件列表fileList 赋值给 this.fileList

      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      // this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      //当前点击的图片赋值给原来已经存在的图片
      this.fileList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //文件上传之前的判断
    beforeUpload(file) {
      //file 上传的文件对象
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      //判断是否在预定范围内
      if (!types.includes(file.type)) {
        this.$message.error('文件格式不匹配！！')
        return false
      }
      //限制文件大小
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('文件太大！！图片大小最大不能超过5M')
        return false

      }
      this.showPercent = true

    },
    //  上传到腾讯云服务器
    upLoad({ file }) {
      if (!file) return

      // 执行上传操作
      cos.putObject({
        Bucket: 'lspoo-tong-1313213541', // 存储桶
        Region: 'ap-hongkong', // 地域
        Key: file.name, // 文件名
        Body: file, // 要上传的文件对象
        StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
        // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
        //提供的上传进度回调
        onProgress: ({ percent }) => {
          this.percentage = percent * 100

        }
      }, (err, data) => {
        // data返回数据之后 应该如何处理
        // console.log(err || data)
        if (err) {
          return Message.error(err?.message || '上传出错')
        }
        this.fileList.forEach(item => {
          if (item.uid === file.uid) {
            //只有成功获取到服务器端图片链接的时候，加一个标识
            //目的提交更新的时候，进行判断，如果当前文件对象里面没有upload属性，不进行提交
            item.url = `http://${data.Location}`
            item.upload = true
          }
        })

        setTimeout(() => {
          this.showPercent = false // 隐藏进度条
          this.percent = 0 // 进度归0
        }, 2000)
      })

    }
  }
}
</script>

<style scoped lang="scss">
.completed {
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
</style>
