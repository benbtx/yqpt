
<style lang="less">

</style>
<template>
    <div>
     <Card>
      <tables  height="500" ref="tables" editable searchable search-place="top" v-model="list_data" :columns="list_columns"/>
        <!-- <Page :total="100" /> -->
        <!-- <Table height="600" highlight-row @on-current-change="modal_selected" :columns="list_columns" :data="list_data"></Table> -->
    </Card>
    </div>
</template>
<script>
import Tables from '_c/tables'
export default {
  components: {
    Tables
  },
  data () {
    return {
      gd: 600,
      list_data: [],
      list_columns: [
        {
          type: 'index',
          key: 'index',
          width: 60,
          align: 'center'
        },

        {
          title: '名称',
          key: 'name',
          width: 300
        },
        {
          title: '来自节点',
          key: 'fromNode',
          width: 300
        },
        {
          title: '说明',
          key: 'remark'

        },
        {
          title: '操作',
          key: 'action',
          width: 300,
          align: 'center',
          render: (h, params, vm) => {
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
                    this.$router.push({ 'name': 'design', 'params': { nodeid: params.row.fromNode, flowid: params.row.flowId, lcmc: params.row.name, lcsm: params.row.remark } })
                  }
                }
              }, '查看'),

              // h('Button', {
              //     props: {
              //         type: 'error',
              //         size: 'small'
              //     },
              //     on: {
              //         click: () => {

              //             console.log(params)
              //             this.delFlow(params.row)
              //         }
              //     }
              // }, '删除'),

              h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要删除吗?'
                },
                on: {
                  'on-ok': () => {
                    // vm.$emit('on-delete', params)
                    // vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
                    console.log(params)
                    this.delFlow(params.row)
                  }
                }
              }, [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      //    console.log(params)
                      // this.delFlow(params.row)

                    }
                  }
                }, '删除')
              ])

            ])
          }
        }
        // {
        // title: '操作',
        // key: 'handle',
        // options: ['delete'],
        // button: [
        //     (h, params, vm) => {
        //     return h('Poptip', {
        //         props: {
        //         confirm: true,
        //         title: '你确定要删除吗?'
        //         },
        //         on: {
        //         'on-ok': () => {
        //             vm.$emit('on-delete', params)
        //             vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
        //         }
        //         }
        //     }, [
        //         h('Button', '查看')
        //     ])
        //     },
        //     (h, params, vm) => {
        //     return h('Poptip', {
        //         props: {
        //         confirm: true,
        //         title: '你确定要删除吗?'
        //         },
        //         on: {
        //         'on-ok': () => {
        //             vm.$emit('on-delete', params)
        //             vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
        //         }
        //         }
        //     }, [
        //         h('Button', '自定义删除')
        //     ])
        //     }
        // ]
        // }

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

    // handleDelete (params) {

    //    console.log(params)
    //        console.log(params)
    //      this.delFlow(params.row)
    // },

    modal_ok: function () {

    },
    loadData: function () {
      let self = this
      this.$axios.post(this.$util.getApi('api/getflows')).then(function (response) {
        if (response.data.status == 'success') {
          self.list_data = response.data.data
        }
      })
    },
    viewFlow: function (flow) {
      let self = this
      this.$axios.post(this.$util.getApi('api/getflowbyid'), { 'flowid': flow.flowId }).then(function (response) {
        if (response.data.status == 'success') {
          console.log(response.data.data)
        } else {
          self.$Message.error(response.data)
        }
      })
    },
    delFlow: function (flow) {
      let self = this
      this.$axios.post(this.$util.getApi('api/delflow'), { 'flowid': flow.flowId }).then(function (response) {
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
