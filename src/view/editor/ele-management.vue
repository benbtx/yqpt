<style lang="less">
.m_root{
    height:400px;
    overflow-y: auto
}
</style>
<template>
    <Modal
        v-model="modal_visible"
        title="选择数据源"
        width="1024"
        @on-ok="modal_ok"
        @on-cancel="modal_cancel">
        <Layout class="m_root">
            <Sider >
                <Menu width="100%" @on-select="menu_click">
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
            </Sider>
            <Content style="flex: 0 1 auto">
                <Upload :action="uploadapi">
                    <Button icon="ios-cloud-upload-outline">上传组件</Button>
                </Upload>
                <Table highlight-row :columns="list_columns" :data="list_data"></Table>
            </Content>

        </Layout>
    </Modal>
</template>
<script>
export default {
  name: 'EleManagemnet',
  props: {
    editors: {
      type: Object,
      default: {}
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      uploadapi: '',
      modal_visible: this.visible,
      work_editors: this.editors,
      list_data: [],
      list_columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '名称',
          key: 'caption'
        },
        {
          title: '语言',
          key: 'lang'
        },
        {
          title: '类型',
          key: 'type'
        },
        {
          title: '说明',
          key: 'remark'
        }
      ]
    }
  },
  mounted () {
    let self = this
    this.uploadapi = this.$util.getApi('api/upload')
    // this.$axios.post(this.$util.getApi('api/geteditors')).then(function(response){
    //     //self.list_data = response.data.data;
    //     console.log(response.data.data)
    // })
  },
  methods: {
    menu_click: function (cmd) {
      this.list_data = this.work_editors[cmd]
    },
    modal_ok: function () {
      this.modal_visible = false
    },
    modal_cancel: function () {
      this.modal_visible = false
    }
  },
  watch: {
    visible (val) {
      this.modal_visible = val
    },
    modal_visible (val) {
      this.$emit('update:visible', val)
    },
    editors (val) {
      this.work_editors = val
      console.log(val)
    },
    work_editors (val) {
      this.$emit('update:editors', val)
    }
  }
}
</script>
