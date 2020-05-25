
<style lang="less">
    .node{
        width:300px;
        margin: 10px 0 0 10px;
        display: inline-block;
        vertical-align:top;
    }
</style>
<template>
    <div @click="disable_contextmenuitem" >
        <!-- style="height:100%" -->
        <Card>
            <div>
                <Card :bordered="false" class="node" :key='item.nodeid'  v-for="item in list_data">
                    <p slot="title">{{item.nodename}}
                        <span :style="getOnlineStyle(item)">{{item.online? item.workstatus : "Offline"}}</span>
                    </p>

                    <a href="#" slot="extra" @click="contextmenu_click($event,item)">
                        <Icon type="md-menu"></Icon>
                    </a>
                    <p>节点Id：{{item.nodeid}}</p>
                    <p>节点IP：{{item.clientip}}</p>
                    <p v-if="item.monitor!=null">CPU：{{item.monitor.cpu}}% Memory：{{item.monitor.memory}}%</p>
                    <p>{{item.remark}}</p>
                    <div :ref="'chart_'+item.nodeid" :id="'chart_'+item.nodeid" style="width:100%;height:100px;">

                    </div>
                    <p>
                        <a href="#" v-if="item.online && item.workstatus=='Idle'" @click="node_run(item)"><Icon size="40" type="md-arrow-dropright-circle" color="green" /></a>
                        <a href="#" v-if="item.online && item.workstatus=='Runing'" @click="node_stop(item)"><Icon  size="40" type="md-close-circle" color="red" /></a>
                    </p>
                </Card>
                <Dropdown :visible="contextmenu_visable" trigger="custom" :style="contextmenu_style" @on-click="contextmenuitem_click">
                    <Dropdown-menu slot="list">
                        <Dropdown-item name="flowdesign">模型设计</Dropdown-item>
                        <Dropdown-item name="flowmonitor">引擎监控</Dropdown-item>
                        <Dropdown-item name="savenodeflow">保存为模板</Dropdown-item>
                    </Dropdown-menu>
                </Dropdown>
            </div>
            <!-- <Table highlight-row :columns="list_columns" :data="list_data"></Table> -->
            <Modal
                    v-model="modal_visiable"
                    title="节点配置"
                    @on-ok="modal_ok"
                    @on-cancel="modal_cancel">

            </Modal>
            <Modal
                    v-model="modal_flow_visiable"
                    title="模板保存"
                    @on-ok="modal_flow_ok"
                    @on-cancel="modal_flow_cancel">
                    <Row type="flex" class="root" ref="root">
                        <Col span="24">
                            <Row type="flex">
                                <Col span="6" class="caption"><span>模板名称</span></Col>
                                <Col span="18" class="edit"><Input v-model="currentflow.name" placeholder="模板名称" /></Col>
                            </Row>
                            <Row type="flex">
                                <Col span="6" class="caption">备注</Col>
                                <Col span="18" class="edit"><Input v-model="currentflow.remark" placeholder="备注" /></Col>
                            </Row>
                        </col>
                    </Row>
            </Modal>
        </Card>
    </div>
</template>
<script>

export default {
  data () {
    return {
      modal_visiable: false,
      canfire_contextmenu_event: true,
      contextmenu_visable: false,
      contextmenu_style: { position: 'absolute' },
      modal_flow_visiable: false,
      selected_node: null,
      currentflow: {},
      charts: {},
      list_data: []

    }
  },
  mounted () {
    this.timer = setTimeout(this.refresh, 1000)
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  },
  methods: {
    modal_ok: function () {

    },
    modal_cancel: function () {

    },
    getOnlineStyle: function (node) {
      return {
        marginRight: '5px',
        color: node.online ? 'green' : 'red'
      }
    },

    refresh: function () {
      let self = this
      this.$axios.post(this.$util.getApi('api/getnodes')).then(function (response) {
        self.list_data = response.data.data
        for (let i in self.list_data) {
          let node = self.list_data[i]
          // let ts =new Date() - node.hearttime
          // if((ts/1000)<5){
          //     node.online = true
          // }
          if (node.online) {
            // 如果没有图表则初始化
            let chartid = 'chart_' + node.nodeid

            if (self.$refs[chartid] != null) {
              if (self.charts[chartid] == null) {
                var chart = echarts.init(self.$refs[chartid][0])
                self.charts[chartid] = {}
                self.charts[chartid].chart = chart
                self.charts[chartid].cpudata = []
                self.charts[chartid].memdata = []
                chart.setOption(self.buildChartOption(self.charts[chartid].cpudata, self.charts[chartid].memdata))
                console.log('chart ok')
              }

              // 动态处理数据
              if (node.monitor != null) {
                let chartcpudata = self.charts[chartid].cpudata
                let chartmemdata = self.charts[chartid].memdata
                if (chartcpudata.length > 30) {
                  chartcpudata.shift()
                }
                if (chartmemdata.length > 30) {
                  chartmemdata.shift()
                }
                let now = new Date()
                chartcpudata.push({
                  name: new Date(),
                  value: [now.getTime(), node.monitor.cpu]
                })
                chartmemdata.push({
                  name: new Date(),
                  value: [now.getTime(), node.monitor.memory]
                })
                self.charts[chartid].chart.setOption({
                  series: [{
                    data: chartcpudata
                  },
                  {
                    data: chartmemdata
                  }]
                })
              }
            }
          }
        }
      })

      self.timer = setTimeout(self.refresh, 1000)
    },
    buildChartOption: function (cpudata, memdata) {
      let option = {
        grid: {
          left: 0,
          right: 5,
          top: 0,
          bottom: 5
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: false
          },
          max: 100
        },
        series: [{
          type: 'line',
          showSymbol: false,
          data: cpudata,
          areaStyle: {}
        },
        {
          type: 'line',
          showSymbol: false,
          data: memdata,
          areaStyle: {}
        }]
      }
      return option
    },
    node_design: function (params) {
      // this.$router.push({"name":"design","params":{nodeid:params.nodeid,flowid:params.row.flowId,lcmc:params.row.name,lcsm:params.row.remark}})
      // this.$router.push({"name":"design","params":{nodeid:params.nodeid,flowid:'',lcmc:'',lcsm:''}})
      let self = this
      this.$axios.post(this.$util.getApi('api/getflowbyid'), { 'flowid': params.flowId }).then(function (response) {
        console.log(response.data.data)
        let data = response.data.data
        self.$router.push({ 'name': 'design', 'params': { nodeid: data.fromNode, flowid: data.flowId, lcmc: data.name, lcsm: data.remark } })

        // self.message_receive(response.data.data)
      })
    },
    node_run: function (params) {
      let self = this
      let postdata = {}
      postdata.nodeid = params.nodeid
      postdata.cmd = JSON.stringify({
        'cmd': 'start'
      })
      postdata.starttime = this.$util.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
      postdata.immediate = false
      this.$axios.post(this.$util.getApi('api/pushcmd'), postdata).then(function (response) {
        console.log(response.data.data)
        // self.message_receive(response.data.data)
      })
    },
    node_stop: function (params) {
      let self = this
      let postdata = {}
      postdata.nodeid = params.nodeid
      postdata.cmd = JSON.stringify({
        'cmd': 'stop'
      })
      postdata.starttime = this.$util.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
      postdata.immediate = false
      this.$axios.post(this.$util.getApi('api/pushcmd'), postdata).then(function (response) {
        console.log(response.data.data)
      })
    },
    disable_contextmenuitem: function () {
      if (this.canfire_contextmenu_event) {
        this.contextmenu_visable = false
      }

      this.canfire_contextmenu_event = true
    },
    contextmenu_click: function (e, node) {
      if (!this.contextmenu_visable) {
        this.canfire_contextmenu_event = false
        this.contextmenu_visable = true
        // this.contextmenu_style.left = (e.clientX ) + "px"
        // this.contextmenu_style.top = (e.clientY + 10) + "px"
        this.contextmenu_style.left = (e.clientX - 120) + 'px'
        this.contextmenu_style.top = (e.clientY - 120) + 'px'
        this.selected_node = node
      } else {
        this.contextmenu_visable = false
      }
    },
    contextmenuitem_click: function (cmd) {
      if (cmd == 'flowdesign') {
        this.node_design(this.selected_node)
      } else if (cmd == 'flowmonitor') {
        let self = this
        let postdata = {}
        postdata.nodeid = self.selected_node.nodeid
        postdata.cmd = JSON.stringify({
          'cmd': 'startmonitflow'
        })
        postdata.starttime = this.$util.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
        postdata.immediate = false
        this.$axios.post(this.$util.getApi('api/pushcmd'), postdata).then(function (response) {
          self.$router.push({ 'name': 'monitor', 'params': { nodeid: self.selected_node.nodeid } })
        })
      } else if (cmd == 'savenodeflow') {
        this.modal_flow_visiable = true
        this.currentflow = {}
        this.currentflow.nodeid = this.selected_node.nodeid
      }
    },
    modal_flow_ok: function () {
      let self = this
      let postdata = {}
      postdata.nodeid = self.currentflow.nodeid
      postdata.name = self.currentflow.name
      postdata.remark = self.currentflow.remark
      this.$axios.post(this.$util.getApi('api/savenodeflow'), postdata).then(function (response) {
        self.message_receive(response.data)
      })
    },
    modal_flow_cancel: function () {},
    message_receive: function (response) {
      if (response.status == 'error') { this.$Message.error(response.data) } else if (response.status == 'warn') { this.$Message.warning(response.data) } else { this.$Message.success(response.data) }
    }
  }
}
</script>
