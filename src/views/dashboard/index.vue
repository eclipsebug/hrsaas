<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <UploadExcel/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mixins } from '@/utils/mixin'

export default {
  name: 'Dashboard',
  mixins: [mixins], //解决组件的逻辑复用
  mounted() {
    this.hello()
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
