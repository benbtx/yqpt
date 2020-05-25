<template>

    <Row type="flex" class="root" ref="root">
        <Col span="24">

            <Row type="flex">
                <Col span="6" class="caption">类型</Col>
                <Col span="18" class="edit">{{currentdata.type}}<Button v-if="enableTypeSelect" @click="openEleType" type="text" icon="ios-search" /></Col>
            </Row>

            <div>
                <Row type="flex"  v-for="item in sysfields" :key="item.code">
                    <Col span="6" class="caption">{{item.caption}}</Col>
                    <Col span="18">
                        <Tooltip v-if="item.edittype=='textbox'" :content="item.remark" placement="top-end">
                            <Input v-if="item.edittype=='textbox'" v-model="currentdata[item.code]" :placeholder="item.default"  />
                        </Tooltip>
                        <Tooltip v-if="item.edittype=='number'" :content="item.remark" placement="top-end">
                            <InputNumber v-if="item.edittype=='number'" v-model="currentdata[item.code]"></InputNumber>
                        </Tooltip>
                        <Tooltip v-if="item.edittype=='checkbox'" :content="item.remark" placement="top-end">
                            <Checkbox v-if="item.edittype=='checkbox'" v-model="currentdata[item.code]"></Checkbox>
                        </Tooltip>
                        <Tooltip v-if="item.edittype=='datasource'" :content="item.remark" placement="top-end">
                            <div style="display:inline-flex">
                            <span style="line-height:32px">{{currentdata[item.code]}}</span>
                            <Button type="text" icon="ios-search" @click="openDatasource"/>
                            </div>
                        </Tooltip>
                    </Col>
                </Row>
                <Divider v-if="customfields.length>0">自定义配置</Divider>
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
                            <Checkbox v-if="item2.edittype=='checkbox'" v-model="currentdata.config[item2.code]"></Checkbox>
                        </Tooltip>
                        <Tooltip v-if="item2.edittype=='sql'" :content="item2.remark" placement="top-end">
                            <div style="display:inline-flex">
                            <Input v-if="item2.edittype=='sql'" v-model="currentdata.config[item2.code]" :placeholder="item2.default" />
                            <Button type="text" icon="ios-search" @click="openEditor(item2.code,item2.edittype)"/>
                            </div>
                        </Tooltip>
                        <Tooltip v-if="item2.edittype=='textarea'" :content="item2.remark" placement="top-end">
                            <div style="display:inline-flex">
                            <Input v-model="currentdata.config[item2.code]" :placeholder="item2.default" />
                            <Button type="text" icon="ios-search" @click="openEditor(item2.code,item2.edittype)"/>
                            </div>
                        </Tooltip>

                        <Tooltip v-if="item2.edittype=='scriptjava'" :content="item2.remark" placement="top-end">
                            <div style="display:inline-flex">
                            <Input v-if="item2.edittype=='scriptjava'" v-model="currentdata.config[item2.code]" :placeholder="item2.default" />
                            <Button type="text" icon="ios-search" @click="openEditor(item2.code,item2.edittype)"/>
                            </div>
                        </Tooltip>
                        <Tooltip v-if="item2.edittype=='json'" :content="item2.remark" placement="top-end">
                            <div style="display:inline-flex">
                            JSON格式
                            <Button type="text" icon="ios-search" @click="openEditor(item2.code,item2.edittype)"/>
                            </div>
                        </Tooltip>
                    </Col>
                </Row>
            </div>

            <Modal
                v-model="modal_visiable"
                title="选择数据源"
                width="800"
                @on-ok="modal_ok"
                @on-cancel="modal_cancel">
                <Table highlight-row @on-current-change="modal_selected" :columns="list_columns" :data="list_data"></Table>
            </Modal>
            <Modal
                v-model="modal_editor_visiable"
                title="数据编辑"
                width="800"
                @on-ok="modal_editor_ok"
                @on-cancel="modal_editor_cancel">
                <div id="text_editor" class="monaco-editor" style="height:300px;"></div>
            </Modal>
        </Col>
    </Row>
</template>

<script>

import * as monaco from 'monaco-editor'
export default {
  name: 'EleSetting',
  props: {

  },
  data () {
    return {
      modal_visiable: false,
      modal_editor: null,
      modal_editor_visiable: false,
      hasds: false,
      cfgEditor: {},
      currentdata: {},
      list_columns: [],
      list_data: [],
      modal_callback: null,
      sysfields: [],
      customfields: [],
      isnew: false,
      editorType: '', // 当前编辑的元素类型
      modal_work: '', // 当前对话框的工作内容
      enableTypeSelect: true
    }
  },
  mounted () {

  },
  // created(){
  //     window.MonacoEnvironment = {
  //         getWorkerUrl: function (moduleId, label) {
  //             if (label === 'json') {
  //             return './language/json/jsonWorker.js';
  //             }
  //             if (label === 'css') {
  //             return './css.worker.bundle.js';
  //             }
  //             if (label === 'html') {
  //             return './html.worker.bundle.js';
  //             }
  //             if (label === 'typescript' || label === 'javascript') {
  //             return './ts.worker.bundle.js';
  //             }
  //             return './editor.worker.bundle.js';
  //         }
  //     }

  // },
  methods: {
    // 设置一个元素的配置信息，形成属性设置列表
    setEditor: function (editors, data, enableTypeSelect) {
      console.log(data)
      this.cfgEditor = editors
      this.refreshEditor()
      this.isnew = false
      this.currentdata = data
      this.editorType = data.category
      if (data.category == 'channel') {
        this.olddata = this.$util.clone(data)
      }
    },
    // 呈现新建元素的界面
    newElement: function (editorType, editor) {
      this.isnew = true
      this.cfgEditor = this.$util.clone(editor != null ? editor : {})
      this.refreshEditor()
      this.editorType = editorType
      if (editorType == 'job') {
        this.currentdata =
                    {
                      category: 'jobs',
                      id: 'job_' + parseInt(Math.random() * 1000000),
                      caption: '作业1',
                      remark: '',
                      type: 'job',
                      components: [

                      ],
                      channels: [

                      ]
                    }
      } else {
        this.currentdata = { type: '请选择类型', config: {} }
      }
    },
    onModal: function (fn) {
      this.modal_callback = fn
    },
    setList: function (list) {
      this.list_data = list
    },
    openEleType: function () {
      // 打开类型选择器
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
      this.modal_work = 'selEditor'
      this.modal_callback(this, 'getEditor', this.editorType)
      this.modal_visiable = true
    },
    openDatasource: function () {
      // 打开数据源选择器
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
      // this.cfgEditor = {}
    },
    getData: function () {
      return this.cfgEditor
    },
    empty: function () {

    },
    modal_ok: function () {
      if (this.modal_work == 'selEditor') {
        this.cfgEditor = this.$util.clone(this.modal_selected_data)
        this.refreshEditor()
        this.currentdata.type = this.cfgEditor.eletype
        if (this.isnew) {
          for (let i in this.sysfields) {
            let code = this.sysfields[i].code
            if (this.sysfields[i].default == '[AUTO]') {
              this.currentdata[code] = this.$prj.newId(this.editorType)
            } else {
              this.currentdata[code] = this.sysfields[i].default
            }
          }
        }
        this.currentdata.config = {}
        for (let i in this.customfields) {
          let code = this.customfields[i].code
          this.currentdata.config[code] = this.customfields[i].default
        }
      } else if (this.modal_work == 'selDataSource') {
        this.currentdata['datasource'] = this.modal_selected_data.id
      }
    },
    modal_cancel: function () {},
    openEditor: function (param, scripttype) {
      console.log(scripttype)
      this.currentParam = param
      let self = this
      this.modal_editor_visiable = true
      let lang = 'sql'
      if (scripttype == 'sql')lang = 'sql'
      else if (scripttype == 'scriptjava')lang = 'java'
      else if (scripttype == 'scriptcsharp')lang = 'csharp'
      else if (scripttype == 'scriptpython')lang = 'python'
      else if (scripttype == 'scriptc')lang = 'c'
      else if (scripttype == 'json')lang = 'json'

      setTimeout(function () {
        let text = ''
        let fe = self.getFieldEditor(self.currentParam)
        if (fe.datatype == 'jsonobject') {
          text = JSON.stringify(self.currentdata.config[self.currentParam])
        } else {
          text = self.currentdata.config[self.currentParam]
        }

        self.modal_editor = monaco.editor.create(document.getElementById('text_editor'),
          {
            value: text,
            language: lang
          })
      }, 500)
    },
    modal_editor_ok: function () {
      let fe = this.getFieldEditor(this.currentParam)
      let rtv = this.modal_editor.getValue()
      console.log(rtv)
      if (fe.datatype == 'jsonobject') {
        try {
          this.currentdata.config[this.currentParam] = JSON.parse(rtv)
        } catch (e) {
          this.$Message.error('JSON字符串解析失败')
        }
      } else {
        this.currentdata.config[this.currentParam] = rtv
      }
      this.modal_editor.dispose()
    },
    getFieldEditor: function (field) {
      for (let i = 0; i < this.cfgEditor.editors.length; i++) {
        if (this.cfgEditor.editors[i].code == field) { return this.cfgEditor.editors[i] }
      }
      return null
    },
    modal_editor_cancel: function () {
      this.modal_editor.dispose()
    },
    modal_selected: function (a, b) {
      this.modal_selected_data = a
    },
    filter: function (fieldtype) {
      if (this.cfgEditor == null || this.cfgEditor.editors == null) return []
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
    },
    getolddata: function () {
      return this.olddata
    },
    refreshEditor (val) {
      // 刷新编辑器
      this.customfields = this.filter('custom')
      this.sysfields = this.filter('system')
    }
  },
  watch: {

    editorType (val) {
      if (val == 'job' || val == 'in' || val == 'process' || val == 'out') { this.enableTypeSelect = false } else { this.enableTypeSelect = true }
    }
  }

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
    .ivu-col {line-height: 32px;}
</style>
