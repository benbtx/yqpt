<template>
    <div>
    <Row type="flex" class="root" ref="root">
        <Col span="24">

            <Row type="flex">
                <Col span="6" class="caption">类型</Col>
                <Col span="18" class="edit">{{currentdata.type}}<Button @click="openEleType" type="text" icon="ios-search" /></Col>
            </Row>
            <!-- <div style="display:none">{{cfgEditor.editors.length}}</div> -->
            <div>
            <Row type="flex"  v-for="item in cfgEditor.editors" >
                <Col span="6" class="caption">{{item.caption}}</Col>
                <Col span="18">
                    <Tooltip v-if="item.edittype=='textbox'" :content="item.remark" placement="top-end">
                        <Input v-if="item.edittype=='textbox'" v-model="currentdata[item.code]" :placeholder="item.default"  />
                    </Tooltip>
                    <Tooltip v-if="item.edittype=='number'" :content="item.remark" placement="top-end">
                        <InputNumber v-if="item.edittype=='number'" v-model="currentdata[item.code]"></InputNumber>
                    </Tooltip>
                    <Tooltip v-if="item.edittype=='checkbox'" :content="item.remark" placement="top-end">
                        <Checkbox v-if="item.edittype=='checkbox'" v-model="currentdata[item.code]">Checkbox</Checkbox>
                    </Tooltip>
                </Col>
            </Row>
            </div>

            <!-- <Row type="flex"  v-for="item in sysfields" :key="item.code">
                <Col span="6" class="caption">{{item.caption}}</Col>
                <Col span="18">
                    <Tooltip v-if="item.edittype=='textbox'" :content="item.remark" placement="top-end">
                        <Input v-if="item.edittype=='textbox'" v-model="currentdata[item.code]" :placeholder="item.default"  />
                    </Tooltip>
                    <Tooltip v-if="item.edittype=='number'" :content="item.remark" placement="top-end">
                        <InputNumber v-if="item.edittype=='number'" v-model="currentdata[item.code]"></InputNumber>
                    </Tooltip>
                    <Tooltip v-if="item.edittype=='checkbox'" :content="item.remark" placement="top-end">
                        <Checkbox v-if="item.edittype=='checkbox'" v-model="currentdata[item.code]">Checkbox</Checkbox>
                    </Tooltip>
                </Col>
            </Row>
            <Divider>自定义配置</Divider>
            <Row type="flex"  v-for="item2 in customfields" :key="item2.code" >
                <Col span="6" class="caption">{{item2.caption}}</Col>
                <Col span="18">
                    <Tooltip v-if="item2.edittype=='textbox'" :content="item2.remark" placement="top-end">
                        <Input v-if="item2.edittype=='textbox'" v-model="currentdata.config[item2.code]" :placeholder="item2.default" />
                    </Tooltip>
                    <Tooltip v-if="item2.edittype=='number'" :content="item2.remark" placement="top-end">
                        <InputNumber v-if="item2.edittype=='number'" v-model="currentdata.config[item2.code]"></InputNumber>
                    </Tooltip>
                    <Tooltip v-if="item2.edittype=='checkbox'" :content="item2.remark" placement="top-end">
                        <Checkbox v-if="item2.edittype=='checkbox'" v-model="currentdata.config[item2.code]">Checkbox</Checkbox>
                    </Tooltip>
                </Col>
            </Row> -->

            <Modal
                v-model="modal_visiable"
                title="选择数据源"
                @on-ok="modal_ok"
                @on-cancel="modal_cancel">
                <div>
                <Table highlight-row @on-current-change="modal_selected" :columns="list_columns" :data="list_data"></Table>
                </div>
            </Modal>
        </Col>
    </Row>
    </div>
</template>

<script>

export default {
  name: 'ModalEleSetting',
  props: {
    editors: Object
  },
  data () {
    return {
      modal_visiable: false,
      hasds: false,
      cfgEditor: this.editors,
      // cfgEditors:this.cfgEditor.editors,
      currentdata: {},
      list_columns: [],
      list_data: [],
      modal_callback: null,
      sysfields: [],
      customfields: [],
      isnew: false,
      editorType: '', // 当前编辑的元素类型
      modal_work: ''// 当前对话框的工作内容
    }
  },
  methods: {
    // 设置一个元素的配置信息，形成属性设置列表
    setEditor: function (editors, data) {
      console.log(data)
      this.cfgEditor = editors
      // for(let i in this.cfgEditor.editors)
      //     this.$set(this.cfgEditors,i,this.cfgEditor.editors[i])
      // this.cfgEditors.push(this.cfgEditor.editors[i])
      // this.sysfields = this.filter('system')
      // this.customfields = this.filter('custom')
      this.isnew = false
      this.currentdata = data
    },
    // 呈现新建元素的界面
    newElement: function (editorType) {
      this.isnew = true
      this.cfgEditor = {}
      this.cfgEditors = []
      this.editorType = editorType
      this.currentdata = { type: '请选择类型', config: {} }
      this.sysfields.splice(0)
      this.customfields.splice(0)
    },
    onModal: function (fn) {
      this.modal_callback = fn
    },
    setList: function (list) {
      this.list_data = list
    },
    openEleType: function () {
      this.list_columns = [
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
          title: '说明',
          key: 'remark'
        }
      ]
      this.modal_work = 'selEditor'
      this.modal_callback(this, 'getEditor', this.editorType)
      this.modal_visiable = true
    },
    openDatasource: function () {
      this.list_columns = [
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
      this.modal_work = 'selDataSource'
      this.modal_callback(this, 'getDataSource')
      this.modal_visiable = true
    },
    getData: function () {
      return this.cfgEditor
    },
    empty: function () {

    },
    modal_ok: function () {
      if (this.modal_work == 'selEditor') {
        let o = this.$util.clone(this.modal_selected_data)
        this.cfgEditor = o
        this.cfgEditors = this.cfgEditor.editors
        this.currentdata.type = this.cfgEditor.eletype
        for (let i in this.cfgEditor.editors) {
          let code = this.cfgEditor.editors[i].code
          if (this.cfgEditor.editors[i].default == '[AUTO]') {
            this.currentdata[code] = this.$prj.newId(this.editorType)
          } else {
            this.currentdata[code] = this.cfgEditor.editors[i].default
          }
        }

        // this.sysfields.splice(0);
        // this.customfields.splice(0);

        // let list = this.filter('system')
        // for(let i in list)
        //     this.sysfields.push(this.$util.clone( list[i]))
        //     //this.$set(this.sysfields,i,list[i])
        // list = this.filter('custom')
        // for(let i in list)
        //     this.customfields.push(this.$util.clone( list[i]))

        // console.log(this.customfields)
        // for(let i in this.sysfields){
        //     let code = this.sysfields[i].code
        //     this.currentdata[code] = this.sysfields[i].default
        // }
        // for(let i in this.customfields){
        //     let code = this.customfields[i].code
        //     this.currentdata.config[code] = this.customfields[i].default
        // }
      }
    },
    modal_cancel: function () {},
    modal_selected: function (a, b) {
      this.modal_selected_data = a
    },
    filter: function (fieldtype) {
      if (this.cfgEditor.editors == null) return []
      let srclist = this.cfgEditor.editors
      let list = []
      for (let i in srclist) {
        if (srclist[i].fieldtype == fieldtype) { list.push(srclist[i]) }
        // list.push(this.cfgEditor.editors[i])
      }

      return list
    },
    getdata: function () {
      return this.currentdata
    }
  }
//         watch:{
//             cfgEditor(val){
//                 console.log(val);
//                 //this.cfgEditor = val
//                 this.customfields.splice(0)
//                 this.customfields = this.filter('custom')
//                 this.sysfields.splice(0)
// this.sysfields = this.filter('system')

//             }
//         }

}
</script>

<style lang="less">
    .caption{
        text-align: right;
        padding-right:10px;
        line-height: 32px
    }
    .edit{
        padding-right:10px;
        line-height: 32px
    }
    .title{
        color:#2d8cf0;
        font-size: 14px;
        display: inline-block;
        height: 100%;
        padding: 8px 16px;
        margin-right: 16px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        cursor: pointer;
        text-decoration: none;
        position: relative;
        -webkit-transition: color 0.3s ease-in-out;
        transition: color 0.3s ease-in-out;
        border-bottom: 1px solid #efefef
    }
</style>
