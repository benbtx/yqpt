<style lang="less">
.root{
  height: 100%;
  position: relative;
}
.header{
  height: 60px;
  width: 100%;
  // position:absolute;
}
.content{
  // width: 100%;
  // top:60px;
  // bottom: 0;
  // position:absolute;
  // padding-top: 60px;
  display: flex;
  min-height: 500px;
  height: calc(100% - 200px);
}
.iconbox{
  margin: 0;
  padding: 0;
  list-style: none;
  height: 300px;
  overflow-x:hidden;
  overflow-y: auto
}
.sider{
  // position:absolute;
  background:transparent;
  width:280px;
  // top:0;
  // bottom: 0;
  // overflow: auto;
  flex-basis: 280px;

}
.right_content{
  flex: 1;
  .caozuo{
    // position: absolute;
    // z-index: 2;
    // height: 37px;
    // width: 100%;
    // vertical-align: middle;
    .tool{
      line-height: 37px;
      // height: 37px;
      color: #ffffff;
      background-color: #006dd3;
      // cursor: pointer!important;
      .commontool{
        margin-left:5px;
        cursor: pointer!important;
        width: 40px;
    display: inline-block;
    text-align: center;
      }
    }
  }
}
.designPanel{
      //  margin-top: 60px;
       margin-top: 95px;

  position:absolute;
  left: 280px;
  right: 0px;
  top:0px;
  bottom: 0px;

}
.designArea{
  position:absolute;
  left: 0px;
  right: 0px;
  top:0px;
  bottom: 0px;

}
.iconbox li{display:inline-block;cursor: pointer; width: 50px;margin: 10px 0 0 10px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color: #333333;text-align:center; border:1px solid #006dd3;}
.iconbox li:hover{background: #006dd3;color: #ffffff;}
</style>
<template>
  <Card>
    千言万语不如一张图，流程图是表示算法思路的好方法
    <div ref="root" class="root">

        <div class="header">
            <Menu mode="horizontal" @on-select="mainmenu_click" >
                <Submenu  name="a">
                    <template slot="title">
                      <Icon type="ios-paper" />工程
                    </template>
                    <MenuItem name="loadflow">应用流程模板</MenuItem>
                    <MenuItem name="save">保存</MenuItem>
                    <MenuItem name="exportConfig">导出配置</MenuItem>
                </Submenu >
                <Submenu name="b">

                    <template slot="title">
                      <Icon type="ios-people"></Icon>组件管理
                    </template>
                    <MenuItem name="eleManagement">组件管理</MenuItem>
                </Submenu>
            </Menu>
            <Modal
                  v-model="modal_flow_visible"
                  title="流程模板"
                  height="400"
                  @on-ok="modal_flow_ok"
                  @on-cancel="modal_flow_cancel">
                  <SelFlow ref="selFlow" :isshow="modal_flow_visible"></SelFlow>
            </Modal>
            <Modal

                v-model="save_flow_visible"
                title="保存流程"
                @on-ok="save_flow_ok"
                @on-cancel="save_flow_cancel">
                <div>流程名称： <Input   v-model="lcmc" placeholder="请输入..." style="width: 350px"/></div>
                <br>
                <div>流程说明： <Input  type="textarea"  v-model="lcsm" placeholder="请输入..." style="width: 350px"/></div>
                <br>
                <div>节点选择：
                    <Select v-model="nodeid" size="large" style="width:350px">
                        <Option v-for="item in nodes" :value="item.nodeId" :key="item.nodeId">{{ item.nodeName+'('+item.nodeId+')' }}</Option>
                    </Select>

                </div>

            </Modal>
        </div>
        <div class="content" ref="rootContent">

            <div ref="designToolbar" class="sider">

              <Tabs value="name1" style='width:95%;    height: 100%;'>
                <TabPane label="工程" name="name1">
                  <PrjSetting ref="prjSetting"></PrjSetting>
                </TabPane>
                <TabPane label="组件" name="name2">
                  <!-- 搜索-->
                   <Input ref='searchText' search placeholder="搜索组件 ..." style='margin-bottom:20px'    @on-search="searchComp"/>
                   <!-- @on-focus="searchComp"  -->
                  <!-- 组件列表-->
                  <Collapse active-key="1" accordion>
                      <Panel key="1">
                          输入组件
                          <p slot="content">
                            <ul class="iconbox">
                              <li v-for="item in editors.in" :key='item.editorid'   :title="item.caption"  @mousedown="onMouseDown($event,'in')">
                                <Icon :name="item.eletype" type="ios-cog" size="40" />
                                <div :name="item.eletype">{{item.caption}}</div>
                              </li>
                            </ul>
                          </p>
                      </Panel>
                      <Panel key="2">
                          过程组件
                          <p slot="content">
                          <ul class="iconbox">
                              <li v-for="item in editors.process" :key='item.editorid' :title="item.caption" @mousedown="onMouseDown($event,'process')">
                                <Icon :name="item.eletype" type="ios-cog" size="40" />
                                <div :name="item.eletype">{{item.caption}}</div>
                              </li>
                            </ul>
                          </p>
                      </Panel>
                      <Panel key="3">
                          输出组件
                          <p slot="content">
                            <ul class="iconbox">
                              <li v-for="item in editors.out" :key='item.editorid'  :title="item.caption" @mousedown="onMouseDown($event,'out')">
                                <Icon :name="item.eletype" type="ios-cog" size="40" />
                                <div :name="item.eletype">{{item.caption}}</div>
                              </li>
                            </ul>
                          </p>
                      </Panel>
                  </Collapse>
                </TabPane>
              </Tabs>

            </div>
            <div class="right_content" ref="right_content">
                <div class='caozuo'>
                  <div class="tool">
                    <Tooltip content="新建" placement="bottom"><span class="commontool xj" @click="xj_click" > <Icon type="md-document" :size="18"></Icon> </span></Tooltip>
                    <Tooltip content="保存" placement="bottom"><span class="commontool save" @click="save_click" >   <img src="../../assets/images/save.svg" class='customSvgIcon' > </span></Tooltip>
                    <Tooltip content="检验" placement="bottom"><span class="commontool jy"  @click="jy_click" > <Icon type="md-checkmark" :size="18"></Icon></span></Tooltip>
                    <Tooltip content="运行" placement="bottom"><span class="commontool yx"  @click="yx_click"  ><Icon type="md-play" :size="18"></Icon></span></Tooltip>
                    <Tooltip content="模拟运行" placement="bottom"><span class="commontool fd"  @click="fd_click"  ><Icon type="md-arrow-dropright-circle" :size="18"></Icon></span></Tooltip>
                    <!-- <Tooltip content="缩小" placement="bottom"><span class="commontool sx"  @click="yx_click"  ><Icon type="md-play" :size="18"></Icon></span></Tooltip> -->
                    <!-- <Tooltip content="删除" placement="bottom"><span class="commontool sc"  @click="yx_click"  ><Icon type="md-play" :size="18"></Icon></span></Tooltip> -->
                  </div>

                </div>
              <Dropdown :visible="contextmenu_visable" trigger="custom" :style="contextmenu_style" @on-click="contextmenuitem_click">
                  <Dropdown-menu slot="list">
                      <Dropdown-item v-for="item in cm_menus" :key='item.name' :name="item.cmd">{{item.name}}</Dropdown-item>
                  </Dropdown-menu>
              </Dropdown>

              <div class='designPanel' ref='designPanel'>
                <div id="designArea" class="designArea">
                  <!-- <div class='caozuo'>
                    <div class="tool"><span class="tool-yx">运行</span></div>
                  </div> -->
                </div>
              </div>

              <Modal
                    v-model="modal_visiable"
                    :title=modal_title
                    @on-ok="modal_ok"
                    @on-cancel="modal_cancel">
                    <EleSetting ref="eleSetting" ></EleSetting>
              </Modal>
              <Management :visible.sync="modal_management_visible" :editors.sync="editors"></Management>
            </div>
            <!-- <Sider class="sider" collapsible :collapsed-width="0" v-model="sider_collapsed" width="300" >
              <EleSetting ref="componentSetting"></EleSetting>
            </Sider> -->
            <div id="editor_box" :style="dragimg_style" style="width:48px;height:48px;border:1px solid #333333;position:absolute;z-index:1000;"></div>

        </div>

    </div>
  </Card>
</template>
<script>

import PrjSetting from './project-setting'
import EleSetting from './ele-setting'
import Management from './ele-management'
import SelFlow from './sel-flow'
import { setTimeout } from 'timers'
// import func from '../../../vue-temp/vue-editor-bridge'
// let prjBuilder = PrjBuilder

export default {
  name: 'design',
  components: {
    EleSetting,
    PrjSetting,
    Management,
    SelFlow
  },
  data () {
    return {
      nodeid: null,
      cm_menus: [],
      editors: {},
      editors_fb: {}, // 副本
      dragStartPos: {}, // 拖拽位置
      dragimg: null,
      dragimg_style: { display: 'none' },
      topo: null,
      contextmenu_style: { position: 'absolute' },
      contextmenu_visable: false,
      modal_visiable: false,
      modal_title: '',
      modal_work: '', // 当前窗口的工作命令
      sider_collapsed: true,
      modal_management_visible: false,
      modal_flow_visible: false,
      save_flow_visible: false, // 保存模板
      lcmc: '', // 流程名称
      lcsm: '', // 流程说明
      flowid: '',
      // nodename:"",
      nodes: [{
        nodeId: '节点1',
        nodeName: '节点1'
      }],
      isrun: false
    }
  },
  created () {
    this.nodeid = this.$route.params.nodeid
    this.flowid = this.$route.params.flowid
    this.lcmc = this.$route.params.lcmc
    this.lcsm = this.$route.params.lcsm
  },
  mounted () {
    let self = this
    this.$axios.post(this.$util.getApi('api/geteditors')).then(function (response) {
      self.editors = response.data.data
      self.editors_fb = JSON.parse(JSON.stringify(response.data.data))
    })

    this.$prj.newProject()

    document.onmousemove = this.onMouseMove
    document.onmouseup = this.onMouseUp
    setTimeout(function () {
      self.topo = new Topo('designArea')
      self.topo.onMessage(self.message_receive)
      self.topo.onContextmenu(self.contextmenu_changed)
      self.topo.onLinkCreated(self.link_created)
      self.topo.onDoubleClick(self.double_click)

      self.loadGraph()
    }, 500)
    // 对树进行重新生成
    this.$refs.prjSetting.refresh()
    this.$refs.prjSetting.onClick(this.projecttree_click)
    this.$refs.prjSetting.onMenuItemClick(this.projectmenu_click)
    this.$refs.eleSetting.onModal(this.elesetting_callback)
    // this.$refs.componentSetting.onModal(this.componentsetting_callback)
    console.log('init')
  },
  methods: {
    refreshTopo: function (jobid) {
      // 重置绘图区域
      // 当前图形保存，切换job，再取出相关图形，填充
      let self = this
      this.$prj.updateGraph(this.topo.getGraph())
      this.$prj.changeJob(jobid)
      let graphjson = this.$prj.getGraph()
      this.topo.loadGraph(graphjson, function (category, dataid) {
        if (category == 'channel') {
          return self.$prj.getChannel(dataid)
        } else {
          return self.$prj.getComponent(dataid)
        }
      })
    },
    findItem: function (type, eletype) {
      for (let i = 0; i < this.editors[type].length; i++) {
        if (this.editors[type][i].eletype == eletype) return this.editors[type][i]
      }
    },
    onMouseDown: function (e, type) {
      if (e.preventDefault) {
        e.preventDefault()
      } else {
        window.event.returnValue = false
      }

      this.dragimg = this.findItem(type, e.target.attributes['name'].value)
      this.dragStartPos.x = e.clientX
      this.dragStartPos.y = e.clientY
    },
    onMouseMove: function (e) {
      if (Math.abs(this.dragStartPos.x - e.clientX) > 0 && Math.abs(this.dragStartPos.y - e.clientY) > 0) {
        if (this.dragimg) {
          let h = this.$refs.rootContent.offsetTop
          this.dragimg_style = {
            // top: (e.clientY - h + 5)+'px',
            // left: (e.clientX + 5)+'px',
            // 减去增加左侧菜单宽度
            top: (e.clientY - h - 80) + 'px',
            left: (e.clientX - 180) + 'px',
            background: '#333333' }
        }
      }
    },
    onMouseUp: function (e) {
      if (this.dragimg) {
        this.dragimg_style = { display: 'none' }
        // var x = e.clientX - this.$refs.designToolbar.clientWidth;
        // var y = e.clientY - this.$refs.root.offsetTop;
        // 减去增加左侧菜单宽度
        var x = e.clientX - this.$refs.designToolbar.clientWidth - 180
        var y = e.clientY - this.$refs.root.offsetTop - 180
        if (x > 0 && y > 0) {
          // 通过编辑器创建新的组件
          let objeditor = this.$util.clone(this.dragimg)
          let data = this.$prj.newComponent(objeditor)
          // this.topo.addNode(data,x,y);
          this.topo.addNode({ 'data': data, 'x': x, 'y': y })
          // 刷新工程树
          this.$refs.prjSetting.refresh()
        }
        this.dragimg = null
      }
    },
    link_created: function (link) {
    // 连线创建时发生，生成通道
      console.log(link)
      if (link.startElement.data.id == link.endElement.data.id) {
        console.log('自身禁止形成link连线')
        return
      }
      link.data = this.$prj.newChannel(link.startElement.data.id, link.endElement.data.id)

      this.$refs.prjSetting.refresh()
    },
    double_click: function () {
      alert(1)
    },

    message_receive: function (msg, type) {
      if (type == 'error') { this.$Message.error(msg) }
      if (type == 'warn') { this.$Message.warning(msg) } else { this.$Message.success(msg) }
    },
    contextmenu_changed: function (e, ele) {
      this.cm_menus.splice(0)
      e.preventDefault()
      if (e.button == 2 && ele) {
        if (ele.type == 'lion.RectElement') {
          // this.cm_menus.push({cmd:'rlink',name:'添加通道'});
          this.cm_menus.push({ cmd: 'link', name: '添加通道' })
          this.cm_menus.push({ cmd: 'setComponent', name: '设置组件' })
          this.cm_menus.push({ cmd: 'delComponent', name: '删除组件' })
        } else if (ele.type == 'lion.LinkElement') {
          this.cm_menus.push({ cmd: 'setChannel', name: '设置通道' })
          this.cm_menus.push({ cmd: 'delChannel', name: '删除通道' })
        } else {
          this.cm_menus.push({ cmd: 'setChannel', name: '设置通道' })
          this.cm_menus.push({ cmd: 'delChannel', name: '删除通道' })
        }

        this.contextmenu_visable = !this.contextmenu_visable
        if (this.contextmenu_visable) {
          // let w = 30;//this.$refs.designToolbar.offsetWidth;
          let w = 340// this.$refs.designToolbar.offsetWidth;
          // 设置菜单位置
          this.contextmenu_style.left = (e.offsetX + w) + 'px'
          this.contextmenu_style.top = e.offsetY + 'px'
          this.targetEle = ele
          this.modal_work = 'setComponent'
        }
      } else {
        this.contextmenu_visable = false
      }
    },
    // 右键菜单点击
    contextmenuitem_click: function (cmd) {
      if (cmd == 'setComponent') {
        this.modal_work = 'setComponent'
        this.modal_title = '组件设置'
        this.editorlist = this.findEditor(this.targetEle.data.category, this.targetEle.data.type)
        this.$refs.eleSetting.setEditor(this.editorlist, this.targetEle.data)
        this.modal_visiable = true
      } else if (cmd == 'delComponent') {
        this.$prj.delComponent(this.targetEle.data.id)
        this.topo.fireEvent(this.targetEle, cmd)
      } else if (cmd == 'setChannel') {
        this.modal_work = 'setChannel'
        this.modal_title = '通道设置'
        this.editorlist = this.findEditor(this.targetEle.data.category, this.targetEle.data.type)
        this.$refs.eleSetting.setEditor(this.editorlist, this.targetEle.data)
        this.modal_visiable = true
      } else if (cmd == 'delChannel') {
        // this.$prj.delElement('jobs.channels',this.targetEle.data.id)
        this.$prj.delChannel(this.targetEle.data.id)
        this.topo.fireEvent(this.targetEle, cmd)
      } else {
        this.topo.fireEvent(this.targetEle, cmd)
      }
      this.$refs.prjSetting.refresh()
      // let editor = this.findEditor(this.targetEle.data.category,this.targetEle.data.type)
      // if(editor!=null)
      //   this.$refs.componentSetting.setEditor(editor,this.targetEle.data);
      this.contextmenu_visable = false
    },
    modal_ok: function () {
      if (this.modal_work == 'log') {
        this.$prj.updateElement('log', this.$refs.eleSetting.getdata())
        this.$refs.prjSetting.refresh()
      } else if (this.modal_work == 'varStorage') {
        this.$prj.updateElement('varStorage', this.$refs.eleSetting.getdata())
        this.$refs.prjSetting.refresh()
      } else if (this.modal_work == 'addDs') {
        this.$prj.addElement('datasources', this.$refs.eleSetting.getdata())
        this.$refs.prjSetting.refresh()
      } else if (this.modal_work == 'addRes') {
        this.$prj.addElement('resources', this.$refs.eleSetting.getdata())
        this.$refs.prjSetting.refresh()
      } else if (this.modal_work == 'addJob') {
        this.$prj.addElement('jobs', this.$refs.eleSetting.getdata())
        this.$refs.prjSetting.refresh()
      } else if (this.modal_work == 'setComponent') {
        let ele = this.$refs.eleSetting.getdata()
        this.$prj.updateComponent(ele)
        this.topo.setText(ele.id, ele.caption)
        this.$refs.prjSetting.refresh()
      } else if (this.modal_work == 'setChannel') {
        let oldele = this.$refs.eleSetting.getolddata()
        let newele = this.$refs.eleSetting.getdata()
        this.$prj.updateChannel(oldele, newele)
        this.$refs.prjSetting.refresh()
      }

      console.log(this.$refs.eleSetting.getdata())
    },
    modal_cancel: function () {

    },
    saveprj: function (callback) {
      // 保存工程文件 实际是修改
      let self = this
      this.$prj.updateGraph(this.topo.getGraph())

      let postdata =
        {
          nodeid: this.nodeid,
          graph: this.$prj.getProject(false),
          config: this.$prj.getProject(true)
        }
      console.log(postdata)
      this.$axios.post(this.$util.getApi('api/save'), postdata).then(function (response) {
        if (callback) {
          callback(response.data.status)
        } else {
          if (response.data.status == 'success') {
            self.$Message.success('保存成功')
          }
        }
      })
    },

    loadGraph: function () {
      if (this.nodeid) {
        var self = this
        var _this = this
        // this.$axios.post(this.$util.getApi('api/getnode'),{nodeid:this.nodeid}).then(function(response){
        //   if(response.data.status == 'success'){
        //     if(response.data.data.graph!=null){
        //       let graph= JSON.parse(response.data.data.graph)
        //       self.$prj.loadProject(graph)
        //       let graphjson = self.$prj.getGraph()
        //       self.topo.loadGraph(graphjson,function(category,dataid){
        //         if(category == 'channel'){
        //             return self.$prj.getChannel(dataid)
        //         }
        //         else{
        //             return self.$prj.getComponent(dataid)
        //         }
        //       })
        //       self.$refs.prjSetting.refresh()
        //     }
        //   }
        // })

        this.$axios.post(this.$util.getApi('api/getflowbyid'), { flowid: this.flowid }).then(function (response) {
          if (response.data.status == 'success') {
            if (response.data.data.graph != null) {
              let graph = JSON.parse(response.data.data.graph)
              self.$prj.loadProject(graph)
              let graphjson = self.$prj.getGraph()
              self.topo.loadGraph(graphjson, function (category, dataid) {
                if (category == 'channel') {
                  return self.$prj.getChannel(dataid)
                } else {
                  return self.$prj.getComponent(dataid)
                }
              })
              self.$refs.prjSetting.refresh()
            }
          }
        })
      }
    },
    mainmenu_click: function (cmd) {
      let self = this
      if (cmd == 'save') {
        this.saveprj()
      } else if (cmd == 'loadflow') {
        // this.loadGraph()
        self.modal_flow_visible = true
      } else if (cmd == 'exportConfig') {
        this.saveprj(function (status) {
          if (status == 'success') {
            window.location = self.$util.getApi('api/exportConfig?nodeid=' + this.nodeid)
          }
        })
      } else if (cmd == 'eleManagement') {
        this.modal_management_visible = true
      }
    },

    // 通过类型寻找编辑器
    findEditor: function (category, type) {
      let list = this.editors[category.toLowerCase()]
      if (type != null) {
        for (let i = 0; i < list.length; i++) {
          let eletype = list[i].eletype
          console.log(eletype == type)
          if (eletype == type) {
            let editor = list[i]
            return this.$util.clone(editor)
          }
        }
      } else {
        return list
      }
    },
    // 工程树上点击后的回调函数
    projecttree_click: function (category, ele) {
      console.log(ele)
      category = category.toLowerCase()
      let list = null
      if (category == 'log') {
        this.modal_work = category
        this.modal_visiable = true
        list = this.findEditor(category, ele.type)
        this.$refs.eleSetting.setEditor(list, ele)
      } else if (category == 'varstorage') {
        this.modal_work = category
        this.modal_visiable = true
        list = this.findEditor(category, ele.type)
        this.$refs.eleSetting.setEditor(list, ele)
      } else if (category == 'datasources') {
        this.modal_work = 'datasource'
        this.modal_visiable = true
        list = this.findEditor('datasource', ele.type)
        this.$refs.eleSetting.setEditor(list, ele, false)
      } else if (category == 'components') {
        this.modal_work = ''
        this.modal_title = '组件设置'
        this.editorlist = this.findEditor(ele.category, ele.type)
        this.$refs.eleSetting.setEditor(this.editorlist, ele)
        this.modal_visiable = true
      } else if (category == 'resources') {
        this.modal_work = 'resource'
        this.modal_visiable = true
        list = this.findEditor('resource', ele.type)
        this.$refs.eleSetting.setEditor(list, ele, false)
      } else if (category == 'channels') {
        this.modal_work = ''
        this.modal_title = '通道设置'
        this.editorlist = this.findEditor('channel', ele.type)
        this.$refs.eleSetting.setEditor(this.editorlist, ele)
        this.modal_visiable = true
      } else if (category == 'loop') {
        this.modal_work = ''
        this.modal_title = '轮询器设置'
        this.editorlist = this.findEditor(ele.category, ele.type)
        this.$refs.eleSetting.setEditor(this.editorlist, ele)
        this.modal_visiable = true
      } else if (category == 'jobs') {
        this.modal_work = ''
        this.modal_title = '作业设置'
        this.editorlist = this.findEditor('job', 'job')
        this.$refs.eleSetting.setEditor(this.editorlist, ele, false)
        this.modal_visiable = true
      }
    },
    // 工程组件上菜单右键点击回调
    projectmenu_click: function (cmd, data) {
      if (cmd == 'addDs') {
        this.modal_work = cmd
        this.modal_title = '添加数据源'
        this.$refs.eleSetting.newElement('datasource')
        this.modal_visiable = true
      } else if (cmd == 'delDs') {
        this.$prj.delElement('datasources', data.__data.id)
        this.$refs.prjSetting.refresh()
      } else if (cmd == 'addRes') {
        this.modal_work = cmd
        this.modal_title = '添加资源'
        this.$refs.eleSetting.newElement('resource')
        this.modal_visiable = true
      } else if (cmd == 'delRes') {
        this.$prj.delElement('resources', data.__data.id)
        this.$refs.prjSetting.refresh()
      } else if (cmd == 'addJob') {
        this.modal_work = cmd
        this.modal_title = '新建作业'
        let editor = this.findEditor('job', 'job')
        this.$refs.eleSetting.newElement('job', editor)
        this.modal_visiable = true
      } else if (cmd == 'setJob') {
        this.modal_work = 'job'
        this.modal_visiable = true
        let list = this.findEditor('job', 'job')
        this.$refs.eleSetting.setEditor(list, data.__data, false)
      } else if (cmd == 'delJob') {
        this.$prj.delElement('jobs', data.__data.id)
        this.$refs.prjSetting.refresh()
      } else if (cmd == 'currentJob') {
        this.refreshTopo(data.__data.id)
        this.$refs.prjSetting.refresh()
      } else if (cmd == 'setComponent') {
        this.modal_work = ''
        this.modal_title = '组件设置'
        this.editorlist = this.findEditor(data.__data.category, data.__data.type)
        this.$refs.eleSetting.setEditor(this.editorlist, data.__data)
        this.modal_visiable = true
      } else if (cmd == 'delComponent') {
        this.$prj.delComponent(data.__data.id)
        // this.$prj.delElement('jobs.components',data.__data.id)
        this.$refs.prjSetting.refresh()
      } else if (cmd == 'setChannel') {
        this.modal_work = 'setChannel'
        this.modal_title = '通道设置'
        this.editorlist = this.findEditor(data.__data.category, data.__data.type)
        this.$refs.eleSetting.setEditor(this.editorlist, data.__data)
        this.modal_visiable = true
      } else if (cmd == 'delChannel') {
        // this.$prj.delElement('jobs.channels',data.__data.id)
        // this.$refs.prjSetting.refresh()

        // this.$prj.delChannel(data.__data.id)
        // 根据id找到元素
        // var c= this.$prj.getChannel(data.__data.id)
        // this.$prj.getProject(false).jobs[0].channels
        // this.topo.fireEvent(c,cmd)
        let links = this.topo.getLinks()

        let keys = Object.keys(links)

        for (let key of keys) {
          if (links[key].data.id == data.__data.id) {
            // this.topo.fireEvent(links[key],cmd);
            this.$prj.delChannel(data.__data.id)
            this.topo.fireEvent(links[key], cmd)
          }
          //  console.log(links[key].id)
        }
        console.log(data)
      }
    },
    elesetting_callback: function (sender, cmd, args) {
      if (cmd == 'getEditor') {
        let list = this.findEditor(args)
        this.$refs.eleSetting.setList(list)
      } else if (cmd == 'getDataSource') {
        let list = this.$prj.getSection('datasources')
        this.$refs.eleSetting.setList(list)
      }
      // sender.setList(this.$prj.getSection(cmd))
    },
    componentsetting_callback: function (sender, cmd, args) {
      sender.setList(this.$prj.getSection(cmd))
    },
    modal_flow_ok: function () {
      let self = this
      let flow = this.$refs.selFlow.selectFlow
      let postdata = {
        nodeid: this.nodeid,
        flowid: flow.flowid
      }

      this.$axios.post(this.$util.getApi('api/nodeuseflow'), postdata).then(function (response) {
        if (response.data.status == 'success') {
          self.$Message.success('操作成功')
          self.$refs.prjSetting.refresh()
          self.loadGraph()
        } else {
          self.$Message.success('操作失败')
        }
      })
      this.modal_flow_visible = false
    },
    modal_flow_cancel: function () {
      this.modal_flow_visible = false
    },
    xj_click: function () {
      // this.$router.go(0);

      // 删除所有组件

      this.$prj.delAllCom()
      this.topo.clearAll()
      // var c=document.getElementById("designArea").querySelector("canvas");
      //  var c=document.getElementById("sfyqcanvas") ;
      // var cxt=c.getContext("2d");
      // c.height=c.height;
      //  cxt.clearRect(0,0,c.width,c.height);

      this.lcmc = ''// 流程名称
      this.lcsm = ''// 流程说明
      this.flowid = ''
      this.nodeid = null
      // this.cm_menus=[];
      // this.editors={};
      // this. dragStartPos={};//拖拽位置
      // this.dragimg=null;
      // this.dragimg_style={display:'none'};
      // this.topo = null;
      // this.contextmenu_style={position: 'absolute'};
      // this.contextmenu_visable=false;
      // this.modal_visiable=false;
      // this.modal_title='';
      // this.modal_work='';//当前窗口的工作命令
      // this.sider_collapsed=true;
      // this.modal_management_visible=false;
      // this.modal_flow_visible=false;
      // this.save_flow_visible=false;//保存模板

      // nodename:"";
      // this.nodes=[{
      //       nodeId: '节点1',
      //       nodeName: '节点1'
      //       },];
      this.isrun = false
      let self = this
      // this.$axios.post(this.$util.getApi('api/geteditors')).then(function(response){
      //   self.editors = response.data.data;
      // })

      this.$prj.newProject()

      // document.onmousemove = this.onMouseMove;
      // document.onmouseup = this.onMouseUp;
      // setTimeout(function(){
      //   self.topo = new Topo('designArea')
      //   self.topo.onMessage(self.message_receive)
      //   self.topo.onContextmenu(self.contextmenu_changed)
      //   self.topo.onLinkCreated(self.link_created)
      //   self.topo.onDoubleClick(self.double_click)

      //   self.loadGraph()
      // },500)
      // //对树进行重新生成
      // this.$refs.prjSetting.refresh()
      // this.$refs.prjSetting.onClick(this.projecttree_click)
      // this.$refs.prjSetting.onMenuItemClick(this.projectmenu_click)
      // this.$refs.eleSetting.onModal(this.elesetting_callback)
      // //this.$refs.componentSetting.onModal(this.componentsetting_callback)
      // console.log('init')
    },

    save_click: function () {
      //  alert('保存成功')
      //  console.log('保存成功');

      console.log(this.$util)
      console.log(this.$prj)
      console.log(this.topo)
      this.saveLC()

      // this.$prj  this.topo
      // 检查当前空间是否有组件，没有不保存，有调用接口生成nodeid
    },
    jy_click: function () {
      //  alert('检验成功')
      var graphjson = this.topo.getGraph()
      if (graphjson.elements.length == 0 && graphjson.links.length == 0) {
        this.$Message.info('模型元素为空，请先设计模型')// warning
      }
    },
    yx_click: function () {
      var graphjson = this.topo.getGraph()
      if (graphjson.elements.length == 0 && graphjson.links.length == 0) {
        this.$Message.info('模型元素为空，请先设计模型')// warning
        return
      }
      //  alert('运行成功')
      let self = this
      if (this.isrun) {
        self.$Message.success('正在运行')
        return
      }

      let postdata =
      {
        flowId: this.flowid,
        // nodeId:'server.1=10.2.5.29:2888:8848',
        nodeId: this.nodeid,
        //  graph:JSON.stringify(this.$prj.getProject(false)),
        // config:JSON.stringify(this.$prj.getProject(false)),
        graph: JSON.stringify(this.$prj.getProject(false)),
        config: JSON.stringify(this.$prj.getProject(true))

      }
      self.isrun = true

      // 添加动画
      // var ele = stage.new(lion.CircleElement);
      // ele.shadow = 'rgb(0,0,0)';
      // ele.backgroundColor = 'red';
      // ele.radius = 3;
      // //绑定路径
      // //获取所以link  this.topo.getLinks()
      // ele.setAnimation(new lion.Animations.PathAnimation(link));
      // stage.currentScene.addElement(ele);
      // scene.foreach(lion.LayerMode.Action,function(ele){
      //     if(ele instanceof lion.LinkElement){

      //     }
      // });

      try {
        this.$axios.post(this.$util.getApi('api/exceFlow'), postdata).then(function (response) {
          if (response.data.status == 'success') {
            self.$Message.success('运行成功')
          }
          self.isrun = false
        })
      } catch (e) {
        console.log(e)
        self.isrun = false
      }
    },

    fd_click: function () {
      let self = this
      var graphjson = this.topo.getGraph()
      if (graphjson.elements.length == 0 && graphjson.links.length == 0) {
        this.$Message.info('模型元素为空，请先设计模型')// warning
        return
      }
      var links = this.topo.getLinks()
      // 重置state
      for (let i = 0; i < Object.keys(links).length; i++) {
        // links[Object.keys(links)[i].state =istrue;
        this.topo.updateLinksState(links[Object.keys(links)[i]], false)
      }

      // watch监听links ，每个link有一个state，默认false,运行第一个link变为true，则增加圆点，依次运行 最后删除圆点 结束流程
      let next = true
      let curindex = 0
      let circle = null
      // 添加动画
      // 绑定路径
      // 获取所以link  this.topo.getLinks()

      let id = null
      id = setInterval(() => {
        for (let i = 0; i < Object.keys(links).length; i++) {
          if (next) {
            if (links[Object.keys(links)[i]].state == false) {
              circle = this.topo.addLinkCircle(links[Object.keys(links)[i]])
              curindex = i
              next = false
            }
          }
          // 运行到最后
          if (curindex == (Object.keys(links).length - 1)) {
            console.log('运行到最后')
            console.log(curindex)
            if (links[Object.keys(links)[curindex]].state) {
              clearInterval(id)
              //    console.log('运行到最后');
              //      console.log(curindex);
              //  this.$Message.success("运行成功");
            }
          }
        }
        // clearInterval(id);
      }, 300)
      let id2 = null
      id2 = setInterval(() => {
        next = true
        this.topo.setLinkCircleState(links[Object.keys(links)[curindex]], true)
        this.topo.removeLinkCircle(circle)
        // 运行到最后
        if (curindex == (Object.keys(links).length - 1)) {
          if (links[Object.keys(links)[curindex]].state) {
            clearInterval(id2)
            console.log('运行到最后')
            console.log(curindex)
            this.$Message.success('运行成功')
            // this.topo.updateLinksState();
          }
        }
      }, 3000)

      // ele.setAnimation(new lion.Animations.PathAnimation(link));
      // stage.currentScene.addElement(ele);
      // scene.foreach(lion.LayerMode.Action,function(ele){
      //     if(ele instanceof lion.LinkElement){

      //     }
      // });
    },

    // yxClick:function(){
    // //获取当前工作流
    // },

    saveLC: function (callback) {
      // 保存工程文件
      let self = this
      var graphjson = this.topo.getGraph()
      if (graphjson.elements.length == 0 && graphjson.links.length == 0) {
        this.$Message.info('流程元素为空，无需保存')// warning
        return
      }
      this.$prj.updateGraph(graphjson)
      // 弹出框写入名称和说明
      this.save_flow_visible = true

      // 查询节点
      this.$axios.get(this.$util.getApi('api/node')).then(function (response) {
        self.nodes = response.data.data
      })

      // let postdata =
      // {
      //   nodeid:this.nodeid,
      //   graph:JSON.stringify(this.$prj.getProject(false)),
      //   config:JSON.stringify(this.$prj.getProject(true))
      // }
      // console.log(postdata)
      // this.$axios.post(this.$util.getApi('api/saveflow'),postdata).then(function(response){
      //   if(callback){
      //     callback(response.data.status)
      //   }
      //   else{
      //     if(response.data.status == 'success'){
      //       self.$Message.success("保存成功");
      //     }
      //   }
      // })
    },

    save_flow_ok: function () {
      let self = this
      if (this.lcmc.trim() == '') {
        this.$Message.warning('请填写流程名称')
        return
      }
      this.$prj.getProject(false).jobs[0].caption = this.lcmc.trim()
      this.$prj.getProject(true).jobs[0].caption = this.lcmc.trim()

      let postdata =
      { flowid: this.flowid,
        nodeId: this.nodeid, // ||"server.1=10.2.5.29:2888:8848",
        graph: JSON.stringify(this.$prj.getProject(false)),
        config: JSON.stringify(this.$prj.getProject(true)),
        name: this.lcmc || '...流程',
        remark: this.lcsm
      }
      console.log(postdata)
      this.$axios.post(this.$util.getApi('api/saveflow'), postdata).then(function (response) {
        if (response.data.status == 'success') {
          self.$Message.success('保存成功')
          self.flowid = response.data.data
        }
      })
    },
    save_flow_cancel: function () {
      this.save_flow_visible = false
    },

    searchComp: function () {
      let text = this.$refs.searchText.currentValue
      let resultsIn = []
      let resultsProcess = []
      let resultsOut = []
      if (text.trim() == '') {
        this.editors = this.editors_fb
      } else {
        for (let item of this.editors.in) {
          if (item.caption.indexOf(text) > -1) {
            resultsIn.push(item)
          }
        }
        this.editors.in = resultsIn
        for (let item of this.editors.process) {
          if (item.caption.indexOf(text) > -1) {
            resultsProcess.push(item)
          }
        }
        this.editors.process = resultsOut

        for (let item of this.editors.out) {
          if (item.caption.indexOf(text) > -1) {
            resultsOut.push(item)
          }
        }
        this.editors.out = resultsOut
      }

      // alert(this.$refs.searchText.currentValue)
    },

    focusSearchComp: function () {
      let text = this.$refs.searchText.currentValue
      let resultsIn = []
      let resultsProcess = []
      let resultsOut = []
      if (text.trim() == '') {
        this.editors = this.editors_fb
      } else {
        for (let item of this.editors.in) {
          if (item.caption.indexOf(text) > -1) {
            resultsIn.push(item)
          }
        }
        this.editors.in = resultsIn
        for (let item of this.editors.process) {
          if (item.caption.indexOf(text) > -1) {
            resultsProcess.push(item)
          }
        }
        this.editors.process = resultsOut

        for (let item of this.editors.out) {
          if (item.caption.indexOf(text) > -1) {
            resultsOut.push(item)
          }
        }
        this.editors.out = resultsOut
      }

      // alert(this.$refs.searchText.currentValue)
    }

  }
}
</script>
