<template>
<div style="height:100%">
  <div style="padding: 0px 15px;min-height:600px;overflow-y:auto;height: calc(100% - 80px);">
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 10px;">
        <Card shadow>
          <chart-pie style="height: 250px;" :value="pieData" text="节点状态占用比例"></chart-pie>
          <!-- 节点占用资源比例 -->
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 10px;">
        <Card shadow>
          <chart-bar style="height: 250px;" :value="barData" text="流程复用量"/>
          <!-- 每周流程复用量 -->
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example style="height: 260px;"/>
      </Card>
    </Row>
  </div>
</div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      inforCardData: [
        // { title: '新增用户', icon: 'md-person-add', count: 803, color: '#2d8cf0' },
        // { title: '累计点击', icon: 'md-locate', count: 232, color: '#19be6b' },
        // { title: '新增问答', icon: 'md-help-circle', count: 142, color: '#ff9900' },
        // { title: '分享统计', icon: 'md-share', count: 657, color: '#ed3f14' },
        // { title: '新增互动', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' },
        // { title: '新增页面', icon: 'md-map', count: 14, color: '#9A66E4' }

        { title: '新增用户', icon: 'md-person-add', count: 803, color: '#2d8cf0' },
        { title: '累计点击', icon: 'md-locate', count: 232, color: '#19be6b' },
        { title: '新增数据库', icon: 'md-help-circle', count: 142, color: '#ff9900' },
        { title: '新增组件', icon: 'md-share', count: 657, color: '#ed3f14' },
        { title: '新增流程', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' },
        { title: '新增节点', icon: 'md-map', count: 14, color: '#9A66E4' }
      ],
      pieData: [
        // { value: 335, name: '直接访问' },
        // { value: 310, name: '邮件营销' },
        // { value: 234, name: '联盟广告' },
        // { value: 135, name: '视频广告' },
        // { value: 1548, name: '搜索引擎' },
        { value: 335, name: 'Offline' },
        { value: 310, name: 'Start' },
        { value: 234, name: 'Stopping' },
        { value: 135, name: 'Idle' },
        { value: 1548, name: 'Runing' }
      ],
      barData: {
        // Mon: 13253,
        // Tue: 34235,
        // Wed: 26321,
        // Thu: 12340,
        // Fri: 24643,
        // Sat: 1322,
        // Sun: 1324
        '星期一': 13253,
        '星期二': 34235,
        '星期三': 26321,
        '星期四': 12340,
        '星期五': 24643,
        '星期六': 1322,
        '星期日': 1324
      }
    }
  },
  created () {
    let self = this
    this.$axios.get(this.$util.getApi('api/getOverview')).then(function (response) {
      if (response.data.status == 'success') {
        self.inforCardData = [
          { title: '失败节点', icon: 'md-share', count: 803, color: '#ed3f14' }, // #2d8cf0
          { title: '运行节点', icon: 'md-share', count: 232, color: '#19be6b' },
          { title: '新增数据库', icon: 'md-albums', count: response.data.data.dataSourceNumber, color: '#ff9900' }, // #ff9900
          { title: '新增组件', icon: 'md-settings', count: response.data.data.componentNumber, color: '#2d8cf0' }, // ed3f14
          { title: '新增流程', icon: 'md-link', count: response.data.data.flowNumber, color: '#E46CBB' },
          { title: '新增节点', icon: 'md-share', count: response.data.data.nodeNumber, color: '#9A66E4' }
        ]
        // swap
      } else {
        self.$Message.error(response.data.data)
      }
    })
    this.$axios.get(this.$util.getApi('api/getNodeStatus')).then(function (response) {
      if (response.data.status == 'success') {
        self.pieData = response.data.data
        // self.pieData=[];
        // // for(let i=0;i++;i<response.data.data.length){
        //    for (var i = 0; i < response.data.data.length; i++) {
        //   self.pieData.push({name: response.data.data[i].name, value: response.data.data[i].value })
        // }
        // console.log(self.pieData)
      } else {
        self.$Message.error(response.data.data)
      }
    })

    this.$axios.get(this.$util.getApi('api/getHistogram')).then(function (response) {
      if (response.data.status == 'success') {
        for (var i = 0; i < response.data.data.length; i++) {
          self.barData[response.data.data[i].time] = response.data.data[i].value
        }
        console.log(self.barData)
      } else {
        self.$Message.error(response.data.data)
      }
    })
  },
  mounted () {
    //
    //

  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
