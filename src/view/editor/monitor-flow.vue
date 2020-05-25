<style>
.root{
  height: 100%;
  position: relative;
}
.monitorFlow{
  height: 100%;
  left:0;
  width:260px;
  position: absolute;
}
.monitorContent{
  height: 100%;
  left:260px;
  right:0;
  position: absolute;
}
.designArea{
  position:absolute;
  left: 0px;
  right: 0px;
  top:0px;
  bottom: 0px;
}
</style>
<template>
    <div class="root">
        <div class="monitorFlow">
        <Menu width="100%" @on-select="menu_click">

            <div v-if='this.isnode'>
                <MenuItem v-for="item in jobs" :key="item.id" :name="item.id">
                    <Icon type="ios-construct" />
                    {{item.caption}}
                </MenuItem>
            </div>
            <div v-else>
                <!-- <MenuItem v-for="item in onWorkNodes" :key="item.nodeid" :name="item.nodename" :nodeid="item.nodeid">
                    <Icon type="ios-construct" />
                    {{item.nodename}}
                </MenuItem> -->
                 <Tree style='padding: 20px;'  :data="onWorkTree" @on-select-change='selectChange'></Tree>

            </div>

        </Menu>
        </div>
        <div class="monitorContent">
            <div id="designArea" class="designArea"></div>
        </div>
    </div>
</template>
<script>
export default {
  components: {

  },
  data () {
    return {
      nodeid: null,
      isnode: false,
      jobs: [],
      editors: {},
      alllinks: {},
      loaded: false,
      onWorkNodes: [],
      onWorkTree: []
    }
  },
  created () {
    this.nodeid = this.$route.params.nodeid// ||"server.2=10.2.5.29:2888:8848"
    if (this.nodeid != null) this.isnode = true
  },
  mounted () {
    let self = this
    this.$axios.post(this.$util.getApi('api/geteditors')).then(function (response) {
      self.editors = response.data.data
    })

    document.onmousemove = this.onMouseMove
    document.onmouseup = this.onMouseUp
    setTimeout(function () {
      self.topo = new Topo('designArea')
      self.topo.onMessage(self.message_receive)
      self.topo.onContextmenu(self.contextmenu_changed)
      self.topo.onLinkCreated(self.link_created)
      if (self.isnode) {
        self.loadGraph()
        self.refresh()
      } else {
        self.getNodes()
      }
    }, 500)
  },
  beforeDestroy () {
    let self = this
    let postdata = {}
    postdata.nodeid = self.nodeid
    postdata.cmd = JSON.stringify({
      'cmd': 'stopmonitflow'
    })
    postdata.starttime = this.$util.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
    postdata.immediate = false
    this.$axios.post(this.$util.getApi('api/pushcmd'), postdata).then(function (response) {
      clearTimeout(self.timer)
    })
  },
  methods: {
    menu_click: function (jobid) {
      let self = this
      this.$prj.changeJob(jobid)
      let graphjson = self.$prj.getGraph()
      self.topo.loadGraph(graphjson, function (category, dataid) {
        if (category == 'channel') {
          return self.$prj.getChannel(dataid)
        } else {
          return self.$prj.getComponent(dataid)
        }
      })

      // 获取所有的连线，形成通道Id->连线id的映射关系
      let links = self.topo.getLinks()
      for (let k in links) {
        let chnid = links[k].data.id
        self.alllinks[chnid] = k
      }
    },
    loadGraph: function () {
      if (this.nodeid) {
        let self = this
        this.$axios.post(this.$util.getApi('api/getnode'), { nodeid: this.nodeid }).then(function (response) {
          if (response.data.status == 'success') {
            if (response.data.data.graph != null) {
              var graph = JSON.parse(response.data.data.graph)
              self.$prj.loadProject(graph)
              self.jobs = self.$prj.getSection('jobs')
              let graphjson = self.$prj.getGraph()
              self.topo.loadGraph(graphjson, function (category, dataid) {
                if (category == 'channel') {
                  return self.$prj.getChannel(dataid)
                } else {
                  return self.$prj.getComponent(dataid)
                }
              })

              // 获取所有的连线，形成通道Id->连线id的映射关系
              let links = self.topo.getLinks()
              for (let k in links) {
                let chnid = links[k].data.id
                self.alllinks[chnid] = k
              }
            }

            self.loaded = true
          }
        })
      }
    },

    // loadGraph:function(){
    //     if(this.nodeid){
    //         var self = this;
    //         var  _this = this;
    //         // this.$axios.post(this.$util.getApi('api/getnode'),{nodeid:this.nodeid}).then(function(response){
    //         //   if(response.data.status == 'success'){
    //         //     if(response.data.data.graph!=null){
    //         //       let graph= JSON.parse(response.data.data.graph)
    //         //       self.$prj.loadProject(graph)
    //         //       let graphjson = self.$prj.getGraph()
    //         //       self.topo.loadGraph(graphjson,function(category,dataid){
    //         //         if(category == 'channel'){
    //         //             return self.$prj.getChannel(dataid)
    //         //         }
    //         //         else{
    //         //             return self.$prj.getComponent(dataid)
    //         //         }
    //         //       })
    //         //       self.$refs.prjSetting.refresh()
    //         //     }
    //         //   }
    //         // })

    //         this.$axios.post(this.$util.getApi('api/getflowbyid'),{flowid:this.flowid}).then(function(response){
    //             if(response.data.status == 'success'){
    //                 if(response.data.data.graph!=null){
    //                     let graph= JSON.parse(response.data.data.graph)
    //                     self.$prj.loadProject(graph)
    //                     let graphjson = self.$prj.getGraph()
    //                     self.topo.loadGraph(graphjson,function(category,dataid){
    //                         if(category == 'channel'){
    //                             return self.$prj.getChannel(dataid)
    //                         }
    //                         else{
    //                             return self.$prj.getComponent(dataid)
    //                         }
    //                     })
    //                     self.$refs.prjSetting.refresh()
    //                 }
    //             }

    //         })

    //           self.loaded = true

    //     }

    // },
    refresh: function () {
      let self = this
      if (self.loaded) {
        let postdata = {}
        postdata.nodeid = self.nodeid
        this.$axios.post(this.$util.getApi('api/getflowmonitor'), postdata).then(function (response) {
          if (response.data.status == 'success') {
            let jobid = self.$prj.getWorkingJob()
            let channels = response.data.data[jobid]
            for (let chnid in channels) {
              let linkid = self.alllinks[chnid]
              console.log(channels[chnid])
              self.topo.updateLink(linkid, channels[chnid])
            }
          }
        })
      }
      self.timer = setTimeout(self.refresh, 1000)
    },
    getNodes: function () {
      let self = this
      this.$axios.post(this.$util.getApi('api/getnodes')).then(function (response) {
        let list_data = response.data.data
        for (let k in list_data) {
          let node = list_data[k]
          // let ts =new Date() - node.hearttime
          // if((ts/1000)<5){
          //     node.online = true
          // }
          if (node.online) {
            if (node.workstatus == 'Runing') {
              self.onWorkNodes.push(node)
            }
          }
        }
        if (self.onWorkNodes.length == 0) {
          self.$Message.success('当前没有节点在运行')
          self.onWorkNodes = list_data
        }
        var treebase = { title: 'parent 1-1',
          expand: true,
          children: [] }

        for (let i in self.onWorkNodes) {
          self.onWorkTree.push({ title: self.onWorkNodes[i].nodename,
            expand: true,
            children: [],
            'render': (h, { root, node, data }) => {
              return h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  'font-size': '14px',
                  margin: '2px'
                }
              }, [ h('span', data.title)])
            }

          })
          for (let j in JSON.parse(self.onWorkNodes[i].graph).jobs) {
            // treebase.title=self.onWorkNodes.nodename;
            self.onWorkTree[i].children.push({ title: JSON.parse(self.onWorkNodes[i].graph).jobs[j].caption, 'nodeid': self.onWorkNodes[i].nodeid, 'jobid': JSON.parse(self.onWorkNodes[i].graph).jobs[j].id, 'expand': true, 'children': [] })
          }
        }
      })
    },

    selectChange: function (params, a) {
      if (this.timer != undefined) { clearTimeout(this.timer) }
      console.log(params)
      console.log(a)
      this.nodeid = params[0].nodeid
      params[0].jobid
      this.loadGraph()
      this.refresh()
    }

    // getNode:function(nodeid){
    //     let self = this
    //         this.$axios.post(this.$util.getApi('api/getnode'),{nodeid:nodeid}).then(function(response){
    //             if(response.data.status == 'success'){

    //                 self.loaded = true
    //             }
    //     })
    // },

  }
}
</script>
