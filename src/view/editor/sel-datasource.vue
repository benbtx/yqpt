<template>
    <Modal
        v-model="modal_visiable"
        title="选择数据源"
        @on-ok="modal_ok"
        @on-cancel="modal_cancel">
        <Table highlight-row @on-current-change="modal_selected" :columns="list_columns" :data="list_data"></Table>
    </Modal>
</template>
<script>
export default {
  data () {
    return {
      modal_visiable: false,
      list_columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: 'Id',
          key: 'id'
        },
        {
          title: '名称',
          key: 'caption'
        },
        {
          title: '说明',
          key: 'remark'
        }
      ]
    }
  },
  mounted () {

  }
}
</script>
