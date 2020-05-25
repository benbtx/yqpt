function PrjBuilder () {
  this.projectData = null
  this.workingJob = null// 当前工作的作业
}
PrjBuilder.prototype.newId = function (category) {
  return category + '_' + parseInt(Math.random() * 1000000)
}
// 生成一个新的工程文件
PrjBuilder.prototype.newProject = function () {
  this.projectData = {
    log: {
      category: 'log',
      id: this.newId('log'),
      caption: '控制台输出',
      remark: '',
      // type:"lionj.element.log.ConsoleLog",
      type: 'lionj.element.logs.ConsoleLog',

      lang: 'java',
      config: {
        path: '/logs'
      }
    },
    varStorage: {
      category: 'varstorage',
      id: this.newId('var'),
      caption: '内存变量',
      remark: '',
      lang: 'java',
      type: 'lionj.element.vars.MemoryStorage'
    },
    datasources: [],
    resources: [],
    jobs: [
      {
        category: 'jobs',
        working: true,
        id: this.newId('job'),
        caption: '作业1',
        remark: '',
        type: 'job',
        enable: true,
        components: [

        ],
        channels: [

        ]
      }
    ]
  }

  this.workingJob = this.projectData.jobs[0]
}

PrjBuilder.prototype.loadProject = function (prj) {
  this.projectData = prj
  this.changeJob(this.projectData.jobs[0].id)
}
// 装换成配置文件
PrjBuilder.prototype.toConfig = function () {

}

PrjBuilder.prototype.getProject = function (onlyconfig) {
  let prj = JSON.parse(JSON.stringify(this.projectData))
  if (onlyconfig) {
    for (let i in prj.jobs) {
      delete prj.jobs[i].graph
    }

    return prj
  } else {
    return this.projectData
  }
}

PrjBuilder.prototype.getConfig = function () {
  let config = JSON.parse(JSON.stringify(this.projectData))
  for (let i in config.jobs) {
    delete config.jobs[i].graph
  }

  return config
}

PrjBuilder.prototype.updateGraph = function (graphJson) {
  this.workingJob['graph'] = graphJson
}

PrjBuilder.prototype.getWorkingJob = function () {
  return this.workingJob.id
}

PrjBuilder.prototype.getGraph = function () {
  return this.workingJob['graph']
}

PrjBuilder.prototype.getComponent = function (eleid) {
  for (let i in this.workingJob.components) {
    let ele = this.workingJob.components[i]
    if (ele.id == eleid) { return ele }
  }
  return null
}

PrjBuilder.prototype.updateComponent = function (component) {
  for (let i in this.workingJob.components) {
    let ele = this.workingJob.components[i]
    if (ele.id == component.id) {
      this.workingJob.components[i] = component
      break
    }
  }
}

PrjBuilder.prototype.getSection = function (section) {
  return this.projectData[section]
}

// 切换当前作业
PrjBuilder.prototype.changeJob = function (jobid) {
  for (let i in this.projectData.jobs) {
    if (this.projectData.jobs[i].id == jobid) {
      this.projectData.jobs[i].working = true
      this.workingJob = this.projectData.jobs[i]
    } else {
      this.projectData.jobs[i].working = false
    }
  }
}

PrjBuilder.prototype.updateElement = function (category, ele) {
  this.projectData[category] = ele
}

PrjBuilder.prototype.addElement = function (category, ele) {
  this.projectData[category].push(ele)
}

PrjBuilder.prototype.delElement = function (category, eleid) {
  let index = -1
  for (let i in this.projectData[category]) {
    if (this.projectData[category][i].id == eleid) {
      index = i
      break
    }
  }

  if (index > -1) this.projectData[category].splice(index, 1)
}

PrjBuilder.prototype.getChannel = function (chnid) {
  let i = this.findChn(chnid)
  if (i > -1) return this.workingJob.channels[i]

  return null
}

// 删除通道，同时删除通道连接的所有组件
PrjBuilder.prototype.__delChannel = function (chnid, job) {
  for (let i = 0; i < job.components.length; i++) {
    let index = -1
    if (job.components[i]['out-channels'] != null) {
      index = job.components[i]['out-channels'].indexOf(chnid)
      if (index > -1) {
        job.components[i]['out-channels'].splice(index, 1)
      }
    }
    if (job.components[i]['in-channels'] != null) {
      index = job.components[i]['in-channels'].indexOf(chnid)
      if (index > -1) {
        job.components[i]['in-channels'].splice(index, 1)
      }
    }
  }

  let chnindex = this.findChn(chnid)
  job.channels.splice(chnindex, 1)
}

PrjBuilder.prototype.delChannel = function (chnid, jobid) {
  let index = -1
  if (jobid == null) {
    this.__delChannel(chnid, this.workingJob)
  } else {
    for (let i in this.projectData.jobs) {
      if (this.projectData.jobs[i].id == jobid) {
        this.__delChannel(chnid, this.projectData.jobs[i])
        return
      }
    }
  }
}

PrjBuilder.prototype.findChn = function (chnid) {
  let chnindex = -1
  for (let i = 0; i < this.workingJob.channels.length; i++) {
    if (this.workingJob.channels[i].id == chnid) {
      chnindex = i
      break
    }
  }

  return chnindex
}

PrjBuilder.prototype.__delComponent = function (eleid, job) {
  let index = -1
  for (let i in job.components) {
    if (job.components[i].id == eleid) {
      index = i
      break
    }
  }
  // 删除关联的通道
  let comp = job.components[index]
  if (comp['out-channels'] != null) {
    for (let i = 0; i < comp['out-channels'].length; i++) {
      this.__delChannel(comp['out-channels'][i], job)
      let chnindex = this.findChn(comp['out-channels'][i])
      if (chnindex > -1) { job.channels.splice(chnindex, 1) }
    }
  }
  if (comp['in-channels'] != null) {
    for (let i = 0; i < comp['in-channels'].length; i++) {
      this.__delChannel(comp['in-channels'][i], job)
      let chnindex = this.findChn(comp['in-channels'][i])
      if (chnindex > -1) { job.channels.splice(chnindex, 1) }
    }
  }
  if (index > -1) job.components.splice(index, 1)
}

PrjBuilder.prototype.delComponent = function (eleid, jobid) {
  let index = -1
  if (jobid == null) {
    this.__delComponent(eleid, this.workingJob)
  } else {
    for (let i in this.projectData.jobs) {
      if (this.projectData.jobs[i].id == jobid) {
        this.__delComponent(eleid, this.projectData.jobs[i])
        return
      }
    }
  }
}

PrjBuilder.prototype.findConfig = function (objeditor, code) {
  for (let i in objeditor.editors) {
    if (objeditor.editors[i].code == code) {
      return objeditor.editors[i].default
    }
  }
}
// 基于编辑器创建一个组件,并返回
PrjBuilder.prototype.newComponent = function (objeditor) {
  let data = {
    id: new Date().getTime().toString(),
    category: objeditor.category,
    caption: objeditor.caption,
    type: objeditor.eletype,
    remark: this.findConfig(objeditor, 'remark'),
    datasource: this.findConfig(objeditor, 'datasource'),
    lang: objeditor.lang,
    loop: {
      type: 'lionj.element.loops.LoopNowait',
      category: 'loop',
      id: this.newId('loop'),
      caption: '无等待循环',
      lang: 'py',
      config: {}
    },
    config: {}
  }
  for (let i in objeditor.editors) {
    if (objeditor.editors[i].fieldtype == 'custom') {
      let fieldedit = objeditor.editors[i]
      data.config[fieldedit.code] = fieldedit.default
    }
  }

  this.workingJob.components.push(data)
  console.log(data)
  return data
}

// 创建一个循环器
// PrjBuilder.prototype.newLoop=function(objeditor){
//     //没有设计器时，创建一个默认的循环器LoopNowait
//     let data = null
//     if(objeditor == null){
//         data = {
//             type:'py.element.loops.LoopNowait',
//             category:'loop',
//             id:this.newId('loop'),
//             caption:'无等待循环',
//             lang:'python',
//             config:{}
//         }
//     }
//     else{
//         data = {
//             id:new Date().getTime().toString(),
//             category:objeditor.category,
//             caption:objeditor.caption,
//             type:objeditor.eletype,
//             remark:this.findConfig(objeditor,'remark'),
//             datasource:this.findConfig(objeditor,'datasource'),
//             lang:objeditor.lang,
//             config:{}
//           }
//         for(let i in objeditor.editors){
//             if( objeditor.editors[i].fieldtype=='custom'){
//                 let fieldedit = objeditor.editors[i]
//                 data.config[fieldedit.code] =fieldedit.default
//             }
//         }
//     }

//     return data;
// }

PrjBuilder.prototype.newChannel = function (ele1, ele2) {
  let data = {
    id: this.newId('channel'),
    category: 'channel',
    caption: '通道',
    type: 'lionj.element.channels.MemoryChannel'
  }

  for (let i in this.workingJob.components) {
    let component = this.workingJob.components[i]
    if (component.id == ele1) {
      if (component['out-channels'] == null) component['out-channels'] = []
      component['out-channels'].push(data.id)
    }

    if (component.id == ele2) {
      if (component['in-channels'] == null) component['in-channels'] = []
      component['in-channels'].push(data.id)
    }
  }
  this.workingJob.channels.push(data)
  return data
}

PrjBuilder.prototype.updateChannel = function (oldchn, newchn) {
  for (let i in this.workingJob.components) {
    let component = this.workingJob.components[i]
    for (let j in component['out-channels']) {
      if (component['out-channels'][j] == oldchn.id) {
        component['out-channels'].splice(j, 1)
        component['out-channels'].push(newchn.id)
        break
      }
    }

    for (let j in component['in-channels']) {
      if (component['in-channels'][j] == oldchn.id) {
        component['in-channels'].splice(j, 1)
        component['in-channels'].push(newchn.id)
        break
      }
    }
  }
}

PrjBuilder.prototype.delAllCom = function () {
  this.workingJob.channels = []
  this.workingJob.components = []
}

let instPrjBuilder = new PrjBuilder()

export function newProject () {
  instPrjBuilder.newProject()
}

export function getSection (section) {
  return instPrjBuilder.getSection(section)
}

export function newComponent (objeditor) {
  return instPrjBuilder.newComponent(objeditor)
}

export function delComponent (eleid, jobid) {
  return instPrjBuilder.delComponent(eleid, jobid)
}
export function delAllCom () {
  return instPrjBuilder.delAllCom()
}

export function getProject (onlyconfig) {
  return instPrjBuilder.getProject(onlyconfig)
}

export function changeJob (jobid) {
  return instPrjBuilder.changeJob(jobid)
}

export function updateElement (category, ele) {
  instPrjBuilder.updateElement(category, ele)
}

export function addElement (category, ele) {
  instPrjBuilder.addElement(category, ele)
}

export function delElement (category, eleid) {
  instPrjBuilder.delElement(category, eleid)
}

export function newId (category) {
  return instPrjBuilder.newId(category)
}

export function newChannel (ele1, ele2) {
  return instPrjBuilder.newChannel(ele1, ele2)
}

// export function newLoop(objeditor) {
//     return instPrjBuilder.newLoop(objeditor)
// }

export function updateGraph (json) {
  instPrjBuilder.updateGraph(json)
}

export function getGraph () {
  return instPrjBuilder.getGraph()
}

export function getConfig () {
  return instPrjBuilder.getConfig()
}

export function getComponent (eleid) {
  return instPrjBuilder.getComponent(eleid)
}
export function updateComponent (component) {
  return instPrjBuilder.updateComponent(component)
}

export function loadProject (prj) {
  return instPrjBuilder.loadProject(prj)
}
export function getWorkingJob () {
  return instPrjBuilder.getWorkingJob()
}
export function getChannel (chnid) {
  return instPrjBuilder.getChannel(chnid)
}
export function delChannel (chnid, jobid) {
  return instPrjBuilder.delChannel(chnid, jobid)
}
export function updateChannel (oldchn, newchn) {
  return instPrjBuilder.updateChannel(oldchn, newchn)
}
export default {
  newProject,
  newComponent,
  // newLoop,
  delComponent,
  getProject,
  changeJob,
  getSection,
  updateElement,
  addElement,
  delElement,
  delAllCom,
  newId,
  newChannel,
  updateGraph,
  getGraph,
  getComponent,
  updateComponent,
  getConfig,
  loadProject,
  getWorkingJob,
  getChannel,
  delChannel,
  updateChannel
}
