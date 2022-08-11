<template>
  <div>
    <el-row type="flex" justify="end">
      <el-select value="" size="mini" v-model="currentYear">
        <el-option :value="item" v-for="item in yearList" :key="item" :label="`${item}年`"></el-option>
      </el-select>
      <el-select v-model="currentMouth" style="margin-left: 20px" size="mini">
        <el-option :value="i" v-for="i in 12" :key="i" :label="`${i}月`"></el-option>
      </el-select>
    </el-row>
    <el-calendar v-model="value">
      <template #dateCell="{date,data:{day}}">
        <div class="data-content">
          <span>{{ day | getDay }}</span>
          <div class="rest" v-if="getShow(date)"><span>休</span></div>


        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>

export default {
  name: 'WorkCalendar',
  filters: {
    getDay(val) {
      return val.split('-')[2]

    }
  },
  props: {
    currenDate: {
      type: Date,
      default: () => new Date()
    }
  },
  computed: {
    //属性 依据选中的而改变日历的数据
    // value() {
    //   return new Date(this.currentYear, this.currentMouth - 1)
    // }
    value: {
      get() {
        return new Date(this.currentYear, this.currentMouth - 1)
      },
      set(val) {
        this.currentYear = val.getFullYear()
        this.currentMouth = val.getMonth() + 1

      }
    }
  },
  data() {
    return {
      currentMouth: null,
      currentYear: null,
      yearList: [] //存储年份的下拉列表
    }
  },
  created() {
    //获取默认选中的年份
    this.currentYear = this.currenDate.getFullYear()
    //获取默认选中的月份
    this.currentMouth = this.currenDate.getMonth() + 1
    //Array.from()的使用方法(数组去重，伪数组转为数组，数组浅克隆)，Set和Map数据结构
    this.yearList = Array.from(Array(11), (item, index) => {
      return this.currentYear + index - 5
    })
  },
  methods: {
    //展示休息
    getShow(day) {
      return [0, 6].includes(day.getDay())

    }
  }
}
</script>
<style scoped lang="scss">
/*.el-calendar__header {*/
/*  display: none;*/
/*}*/
.data-content {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .rest {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: red;
    border-radius: 50%;
    color: white;
    line-height: 20px;
    text-align: center;
  }
}
</style>
