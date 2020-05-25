import http from './http.js'
// import config from '../public/json/config.json'
let config
function Util () {
  let self = this
  this.config = http.get('/json/config.json').then(function (response) {
    config = response.data
  })
}

Util.prototype.clone = function (data) {
  return JSON.parse(JSON.stringify(data))
}

Util.prototype.getApi = function (api) {
  return config.host + '/' + api
}

Util.prototype.formatDate = function (date, format) {
  if (!date) return
  if (!format) { format = 'yyyy-MM-dd' }
  switch (typeof date) {
    case 'string':
      date = new Date(date.replace(/-/, '/'))
      break
    case 'number':
      date = new Date(date)
      break
  }
  if (!(date instanceof Date)) return
  var dict = {
    'yyyy': date.getFullYear(),
    'M': date.getMonth() + 1,
    'd': date.getDate(),
    'H': date.getHours(),
    'm': date.getMinutes(),
    's': date.getSeconds(),
    'MM': ('' + (date.getMonth() + 101)).substr(1),
    'dd': ('' + (date.getDate() + 100)).substr(1),
    'HH': ('' + (date.getHours() + 100)).substr(1),
    'mm': ('' + (date.getMinutes() + 100)).substr(1),
    'ss': ('' + (date.getSeconds() + 100)).substr(1)
  }
  return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
    return dict[arguments[0]]
  })
}

let util = new Util()

// 克隆
export function clone (data) {
  return util.clone(data)
}
export function getApi (api) {
  return util.getApi(api)
}
export function formatDate (date, format) {
  return util.formatDate(date, format)
}

export default {
  clone,
  getApi,
  formatDate
}
