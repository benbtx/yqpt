
<style lang="less">

</style>
<template>
    <div>
        <Card>
            <div style='    margin-bottom: 5px;'>
                <Button type="primary" @click="addDs">创建数据源</Button>
            </div>
            <!-- <tables  height="500" ref="tables" editable searchable search-place="top" v-model="list_data" :columns="list_columns"/> -->

            <Table highlight-row @on-current-change="modal_selected" :columns="list_columns" :data="list_data"></Table>
            <Modal
                v-model="modal_visiable"
                title="数据源编辑"
                width="800"
                @on-ok="modal_ok"
                @on-cancel="modal_cancel">
                <Row>
                    <Col span="6">名称</Col>
                    <Col span="18"><Input v-model="dsdata.caption" placeholder="请输入数据源名称" style="width: 300px" /></Col>
                </Row>
                <Row>
                    <Col span="6">类型</Col>
                    <Col span="18"><Input v-model="dsdata.eletype"  placeholder="请输入数据源类型" style="width: 300px" /></Col>
                </Row>
                <Row>
                    <Col span="6">备注</Col>
                    <Col span="18"><Input v-model="dsdata.remark"  placeholder="请输入备注" style="width: 300px" /></Col>
                </Row>
                <Table highlight-row :columns="list_config_columns" :data="list_config_data"></Table>
            </Modal>
        </Card>
    </div>
</template>
<script>

export default {
  data () {
    let self = this
    return {
      modal_visiable: false,
      dsdata: {
        caption: '',
        eletype: '',
        type: 'lionj.element.ds.KvDatasource',
        category: 'datasource'
      },
      list_config_data: [],
      list_data: [],
      list_columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },

        {
          title: '名称',
          key: 'name'
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
          key: 'eletype'
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
                    this.viewDs(params.row)
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
                    this.delDs(params.row)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      list_config_columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '类型',
          width: 100,
          align: 'center',
          key: 'fieldtype'
        },
        {
          title: '字段类型',
          key: 'code',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Input', {
                props: {
                  'readonly': self.list_config_data[params.index].fieldtype == 'system',
                  'value': self.list_config_data[params.index].code
                },
                on: {
                  'on-change': (event) => {
                    self.list_config_data[params.index].code = event.target.value
                  }
                }
              })
            ])
          }
        },
        {
          title: '名称',
          key: 'caption',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Input', {
                props: {
                  'readonly': self.list_config_data[params.index].fieldtype == 'system',
                  'value': self.list_config_data[params.index].caption
                },
                on: {
                  'on-change': (event) => {
                    self.list_config_data[params.index].caption = event.target.value
                  }
                }
              })
            ])
          }
        },
        {
          title: '默认值',
          key: 'default',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Input', {
                props: {
                  'readonly': self.list_config_data[params.index].fieldtype == 'system',
                  'value': self.list_config_data[params.index].default
                },
                on: {
                  'on-change': (event) => {
                    self.list_config_data[params.index].default = event.target.value
                  }
                }
              })
            ])
          }
        },
        {
          title: '备注',
          key: 'remark',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Input', {
                props: {
                  'value': self.list_config_data[params.index].remark
                },
                on: {
                  'on-change': (event) => {
                    self.list_config_data[params.index].remark = event.target.value
                  }
                }

              })
            ])
          }
        },

        {
          title: '操作',
          key: 'action',
          width: 130,
          align: 'center',
          render: (h, params) => {
            return h('div', self.buildBtn(h, params))
          }
        }
      ]

    }
  },
  mounted () {
    console.log('flow')

    this.loadData()
  },
  beforeDestroy () {
  },
  methods: {

    buildBtn: function (h, params) {
      let btns = []
      if (this.list_config_data.length > 1 && this.list_config_data[params.index].fieldtype != 'system') {
        btns.push(h('Button', {
          props: {
            type: 'error',
            size: 'small'
          },
          on: {
            click: () => {
              this.delKV(params.index)
            }
          }
        }, '删除'))
      }

      if (params.index == this.list_config_data.length - 1) {
        btns.push(h('Button', {
          props: {
            type: 'primary',
            size: 'small'
          },
          on: {
            click: () => {
              this.addKV()
            }
          }
        }, '添加'))
      }

      return btns
    },
    modal_ok: function () {
      this.dsdata.editors = []
      for (let k in this.list_config_data) {
        if (this.list_config_data[k].code && this.list_config_data[k].code != '') {
          this.dsdata.editors.push(this.list_config_data[k])
        }
      }
      console.log(this.dsdata)
      let self = this
      this.$axios.post(this.$util.getApi('api/saveeditor'), this.dsdata).then(function (response) {
        if (response.data.status == 'success') {
          console.log(response.data.data)
          self.$Message.success(response.data.data)
          self.loadData()
        } else {
          self.$Message.error(response.data.data)
        }
      })
    },
    modal_cancel: function () {

    },
    loadData: function () {
      let self = this
      this.$axios.post(this.$util.getApi('api/getallds')).then(function (response) {
        if (response.data.status == 'success') {
          self.list_data = response.data.data
        }
      })
    },
    addDs: function () {
      this.dsdata = {
        caption: '',
        eletype: '',
        type: 'lionj.element.ds.KvDatasource',
        category: 'datasource'
      }
      // 系统自带的参数
      this.list_config_data = []
      this.list_config_data.push({
        'code': 'id',
        'caption': 'Id',
        'datatype': 'string',
        'edittype': 'textbox',
        'default': '[AUTO]',
        'remark': '请输入Id',
        'fieldtype': 'system'
      })
      this.list_config_data.push({
        'code': 'caption',
        'caption': '名称',
        'datatype': 'string',
        'edittype': 'textbox',
        'default': '',
        'remark': '请输入名称',
        'fieldtype': 'system'
      })
      this.list_config_data.push({
        'code': 'remark',
        'caption': '备注',
        'datatype': 'string',
        'edittype': 'textbox',
        'default': '',
        'remark': '请输入备注',
        'fieldtype': 'system'
      })
      this.modal_visiable = true
    },
    addKV: function () {
      this.list_config_data.push({ code: '', datatype: 'string', edittype: 'textbox', caption: '', default: '', remark: '', fieldtype: 'custom' })
    },
    delKV: function (index) {
      this.list_config_data.splice(index, 1)
    },
    viewDs: function (data) {
      let self = this
      this.$axios.post(this.$util.getApi('api/geteditor'), { 'editorid': data.editorId }).then(function (response) {
        if (response.data.status == 'success') {
          self.dsdata = response.data.data
          self.list_config_data = response.data.data.editors
          console.log(response.data.data)
          self.modal_visiable = true
        } else {
          self.$Message.error(response.data)
        }
      })
    },
    delDs: function (data) {
      let self = this
      this.$axios.post(this.$util.getApi('api/deleditor'), { 'editorid': data.editorId }).then(function (response) {
        if (response.data.status == 'success') {
          self.$Message.success('删除成功')
          self.loadData()
        } else {
          self.$Message.error(response.data)
        }
      })
    },
    modal_selected: function () {

    }

  }
}
</script>
