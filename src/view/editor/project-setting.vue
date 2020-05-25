<template>
    <div style="position: relative;height:100%" @click="contextmenu_visable=false">
        <Tree ref="tree" height="100%" :data="projectData" @on-select-change="node_click" :render="renderContent"></Tree>
        <Dropdown :visible="contextmenu_visable" trigger="custom" :style="contextmenu_style" @on-click="contextmenuitem_click">
            <Dropdown-menu slot="list">
                <!-- <Dropdown-item name="add">添加</Dropdown-item>
                <Dropdown-item name="del">删除</Dropdown-item> -->
                <Dropdown-item v-for="item in contextmenu_items" :key='item.cmd' :name="item.cmd">{{item.name}}</Dropdown-item>
            </Dropdown-menu>
        </Dropdown>
    </div>
</template>

<script>

let self
export default {
  name: 'PrjSetting',
  data () {
    return {
      projectData: [],
      contextmenu_visable: false,
      contextmenu_style: { position: 'absolute' },
      contextmenu_items: [],
      selectedNode: null
    }
  },
  mounted () {
    self = this

    this.treedata = {
      title: '工程',
      expand: true,
      children: []
    }
    this.projectData.push(this.treedata)
    // console.log(this.$prj.getProject())
  },
  methods: {
    renderContent (h, { root, node, data }) {
      return h('span', {
        style: {
          cursor: 'pointer',
          color: node.node.selected ? '#2d8cf0' : '#666' // 根据选中状态设置样式
        },
        domProps: {
          className: 'btn'
        },
        on: {
          click: (e) => {
            console.log(self)
            this.contextmenu_visable = false
            if (!node.node.selected) { this.$refs.tree.handleSelect(node.nodeKey) } // 手动选择树节点
          },
          contextmenu: (e) => {
            e.preventDefault()
            // this.$refs.tree.handleSelect(node.nodeKey);
            if (node.node.menus == null) {
              this.contextmenu_visable = false
              return
            }

            this.contextmenu_items = node.node.menus
            if (!this.contextmenu_visable) {
              this.contextmenu_visable = true
              this.contextmenu_style.left = (e.layerX) + 'px'
              this.contextmenu_style.top = e.layerY + 'px'
              this.selectedNode = node.node
            } else {
              this.contextmenu_visable = false
            }
          }
        }
        // },data.title)
      }, [
        h('span', [
          h('Icon', {
            props: (function () {
              let type = ''
              if (node.node.category == 'project') { type = 'ios-albums-outline' } else if (node.node.category == 'log') { type = 'ios-document-outline' } else if (node.node.category == 'resources') { type = 'ios-keypad-outline' } else if (node.node.category == 'datasources') { type = 'ios-keypad-outline' } else if (node.node.category == 'jobs') { type = 'ios-construct-outline' } else if (node.node.category == 'job') { type = 'ios-build' } else if (node.node.category == 'components') {
                if (node.node.category == 'in') { type = 'md-arrow-forward' } else if (node.node.category == 'process') { type = 'ios-settings' } else if (node.node.category == 'out') { type = 'md-arrow-back' }
              }

              return { type: type }
            })(),
            style: {
              marginRight: '8px'
            }
          }),
          h('span', data.title)
        ])
      ])
    },
    onMenuItemClick: function (fn) {
      this.miclick_callback = fn
    },
    // 右键菜单点击
    contextmenuitem_click: function (cmd) {
      this.contextmenu_visable = false
      this.miclick_callback(cmd, this.selectedNode)
    },
    refresh: function () {
      let prj = this.$prj.getProject()
      this.treedata.children = []
      this.treedata.children.push(this.buildNode(prj.log))
      this.treedata.children.push(this.buildNode(prj.varStorage))
      this.treedata.children.push(this.buildNodeRes(prj.resources))
      this.treedata.children.push(this.buildNodeDs(prj.datasources))
      this.treedata.children.push(this.buildNodeJob(prj.jobs))
    },

    buildNode: function (ele) {
      return {
        category: ele.category,
        title: ele.caption,
        type: ele.type,

        __data: ele

      }
    },
    buildNodeDs: function (eles) {
      let list = []
      for (let k in eles) {
        let node = {
          category: 'datasources',
          title: eles[k].caption,
          type: eles[k].type,
          __data: eles[k],
          menus: [
            {
              cmd: 'delDs',
              name: '删除数据源'
            }
          ]
        }
        list.push(node)
      }

      let parent = {
        category: 'datasources',
        title: '数据源',
        type: 'NONE',
        expand: true,
        children: list,
        menus: [
          {
            cmd: 'addDs',
            name: '添加数据源'
          }
        ]
      }

      return parent
    },
    buildNodeRes: function (eles) {
      let list = []
      for (let k in eles) {
        let node = {
          category: 'resources',
          title: eles[k].caption,
          type: eles[k].type,
          __data: eles[k],
          menus: [
            {
              cmd: 'delRes',
              name: '删除资源'
            }
          ]
        }
        list.push(node)
      }

      let parent = {
        category: 'resources',
        title: '资源',
        type: 'NONE',
        expand: true,
        children: list,
        menus: [
          {
            cmd: 'addRes',
            name: '添加资源'
          }
        ]
      }

      return parent
    },
    buildNodeChannel: function (eles) {
      let list = []
      for (let k in eles) {
        let node = {
          category: 'channels',
          title: eles[k].caption,
          type: eles[k].type,
          __data: eles[k],
          menus: [
            {
              cmd: 'setChannel',
              name: '设置通道'
            },
            {
              cmd: 'delChannel',
              name: '删除通道'
            }
          ]
        }
        list.push(node)
      }

      let parent = {
        category: 'channels',
        title: '通道',
        type: 'NONE',
        expand: true,
        children: list,
        menus: null
      }

      return parent
    },
    buildNodeComponent: function (eles) {
      let list = []
      for (let k in eles) {
        let node = {
          category: 'components',
          title: eles[k].caption,
          type: eles[k].type,
          __data: eles[k],
          expand: true,
          children: [
            {
              category: 'loop',
              title: eles[k].loop.caption,
              type: eles[k].loop.type,
              __data: eles[k].loop
            }
          ],
          menus: [
            {
              cmd: 'setComponent',
              name: '设置组件'
            },
            {
              cmd: 'delComponent',
              name: '删除组件'
            }
          ]
        }
        list.push(node)
      }

      let parent = {
        category: 'components',
        title: '组件',
        type: 'NONE',
        expand: true,
        children: list,
        menus: null
      }

      return parent
    },
    buildNodeJob: function (jobs) {
      function getJobCaption (job) {
        if (job.working) return job.caption + ' [工作]'
        else return job.caption
      }

      let list = []
      for (let k in jobs) {
        let node = {
          category: 'jobs',
          expand: true,
          title: getJobCaption(jobs[k]),
          type: jobs[k].type,
          __data: jobs[k],
          children: [],
          menus: [
            {
              cmd: 'currentJob',
              name: '设置当前作业'
            },
            {
              cmd: 'setJob',
              name: '设置作业'
            },
            {
              cmd: 'delJob',
              name: '删除作业'
            }
          ]
        }
        list.push(node)

        node.children.push(this.buildNodeComponent(jobs[k].components))
        node.children.push(this.buildNodeChannel(jobs[k].channels))
      }

      let parent = {
        category: 'jobs',
        title: '作业',
        type: 'NONE',
        expand: true,
        children: list,
        menus: [
          {
            cmd: 'addJob',
            name: '添加作业'
          }
        ]
      }
      return parent
    },
    onClick: function (fn) {
      this.click_callback = fn
    },
    node_click: function (a, node, c) {
      if (node.type != 'NONE') {
        this.click_callback(node.category, node.__data)
      }
    }

  }

}
</script>

<style lang="less">
    .caption{
        text-align: right;
        padding-right:10px;
        line-height: 32px}
</style>
