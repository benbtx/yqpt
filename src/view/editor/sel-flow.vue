<style >
.ivu-table-body{
    height:450px;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: calc(100% - 100px)
}
</style>
<template>
    <Table highlight-row @on-current-change="modal_selected" :columns="list_columns" :data="list_data"></Table>
</template>
<script>
export default {
  name: 'SelFlow',
  data () {
    return {
      selectFlow: null,
      modal_visiable: false,
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
          title: '说明',
          key: 'remark'
        }
      ]
    }
  },
  mounted () {

  },
  created () {

  },
  props: {
    isshow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    modal_selected: function (val) {
      this.selectFlow = val
    }
  },
  watch: {
    isshow (val) {
      if (val) {
        let self = this
        this.$axios.post(this.$util.getApi('api/getflows')).then(function (response) {
          if (response.data.status == 'success') {
            self.list_data = response.data.data
          }
        })
      }
    }
  }

}
</script>
