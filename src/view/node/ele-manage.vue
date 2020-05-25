<style lang="less">
.ele_root{
        // position: relative;;
    // height:100%;
        // height: calc(100% - 128px);
        //绝对布局改flex布局
    display: flex;
    flex-flow:row;
    // height: calc(100% - 150px);
    height: calc(100% - 128px);
    min-height: 540px;

}

.ele_left{
    // position:absolute;
    // top: 0;
    // bottom: 0;
    width: 200px;
    flex:0 0 auto;
    // flex-basis: 200px;
    //   margin:20px;
}
.ele_content{
    // position:absolute;
    // top: 0;
    // bottom: 0;
    // left: 200px;
    // right: 0;
    // overflow-y: auto;

    // flex: 1;
     flex:0 1 auto;
         min-width: calc(100% - 220px);
    // flex-grow: 1;
}
</style>
<template>
    <!-- <div>
        <div style="height:50px"></div>

    </div> -->
    <Card>
        <div class="ele_root">

                <div class="ele_left">
                    <Menu width="100%" style="height:100%" @on-select="menu_click">
                        <MenuItem name="log">日志</MenuItem>
                        <MenuItem name="varStorage">变量域</MenuItem>
                        <MenuItem name="datasource">数据源</MenuItem>
                        <MenuItem name="resource">资源</MenuItem>
                        <Submenu name="component">
                            <template slot="title">
                                <Icon type="ios-people" />
                                组件
                            </template>
                            <MenuItem name="in">输入组件</MenuItem>
                            <MenuItem name="process">过程组件</MenuItem>
                            <MenuItem name="out">输出组件</MenuItem>
                        </Submenu>
                        <MenuItem name="channel">通道</MenuItem>
                    </Menu>
                </div>
                <div class="ele_content">
                    <div>
                        <Upload :action="uploadapi">
                            <Button icon="ios-cloud-upload-outline">上传组件</Button>
                        </Upload>
                        <Table highlight-row :columns="list_columns" :data="list_data"></Table>
                    </div>

                </div>

        </div>
    </Card>

</template>
<script>
export default {
  // props:{
  //     editors:{
  //         type: Object,
  //         default: {}
  //     },
  //     visible:{
  //         type: Boolean,
  //         default: false
  //     }
  // },
  data () {
    return {
      uploadapi: '',
      work_editors: {},
      list_data: [],
      list_columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '名称',
          width: 200,
          key: 'caption'
        },
        {
          title: '语言',
          width: 100,
          key: 'lang'
        },
        {
          title: '类型',
          width: 240,
          key: 'type'
        },
        {
          title: '说明',
          key: 'remark'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    // this.viewFlow(params.row)
                    // params.row.editorid
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.del_element(params.row)
                  }
                }
              }, '删除')
            ])
          }
        }
      ]
    }
  },
  mounted () {
    console.log('ele')
    this.uploadapi = this.$util.getApi('api/upload')
    this.loadData()
  },
  methods: {
    loadData: function () {
      let self = this
      this.$axios.post(this.$util.getApi('api/geteditors')).then(function (response) {
        self.work_editors = response.data.data
      })
    },
    menu_click: function (cmd) {
      this.list_data = this.work_editors[cmd]
    },
    modal_ok: function () {
      this.modal_visible = false
    },
    modal_cancel: function () {
      this.modal_visible = false
    },
    del_element (data) {
      let self = this
      this.$axios.post(this.$util.getApi('api/deleditor'), { 'editorid': data.editorid }).then(function (response) {
        if (response.data.status == 'success') {
          self.$Message.success('删除成功')
          self.loadData()
        } else {
          self.$Message.error(response.data)
        }
      })
    }
  },
  watch: {
    // visible(val) {
    //     this.modal_visible = val;

    // },

    // editors(val) {
    //     this.work_editors = val;
    //     console.log(val)
    // },
    // work_editors(val){
    //     this.$emit('update:editors', val)
    // }
  }
}
</script>
