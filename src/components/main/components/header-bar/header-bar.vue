<template>
  <div class="header-bar">
    <span style="font-size:20px;font-weight:bold;">
          <img class="title-icon" :src="titleURL">九洲AI算法引擎平台</span>
    <!-- <sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollpasedChange"></sider-trigger>
    <custom-bread-crumb show-icon style="margin-left: 30px;" :list="breadCrumbList"></custom-bread-crumb> -->
    <div class="custom-content-con">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import siderTrigger from './sider-trigger'
import customBreadCrumb from './custom-bread-crumb'
import './header-bar.less'
export default {
  name: 'HeaderBar',
  data () {
    return {
      titleURL: require('@/assets/images/jiuzhou-LOGO.png')
    }
  },
  components: {
    siderTrigger,
    customBreadCrumb
  },
  props: {
    collapsed: Boolean
  },
  computed: {
    breadCrumbList () {
      return this.$store.state.app.breadCrumbList
    }
  },
  methods: {
    handleCollpasedChange (state) {
      this.$emit('on-coll-change', state)
    }
  }
}
</script>
<style scoped>
.title-icon{
  max-width: 40px;
    max-height: 40px;
    margin-right: 10px;
    vertical-align: middle;
}
</style>>
