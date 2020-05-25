export default{
  install (Vue, options) {
    // 判断各种浏览器，找到正确的方法
    Vue.prototype.fullScreen = function () {
      var el = document.documentElement,
        rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
        wscript

      if (typeof rfs !== 'undefined' && rfs) {
        rfs.call(el)
        return
      }

      if (typeof window.ActiveXObject !== 'undefined') {
        wscript = new ActiveXObject('WScript.Shell')
        if (wscript) {
          wscript.SendKeys('{F11}')
        }
      }
    },
    Vue.prototype.exitFullScreen = function () {
      var el = document,
        cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
        wscript

      if (typeof cfs !== 'undefined' && cfs) {
        cfs.call(el)
        return
      }

      if (typeof window.ActiveXObject !== 'undefined') {
        wscript = new ActiveXObject('WScript.Shell')
        if (wscript != null) {
          wscript.SendKeys('{F11}')
        }
      }
    },
    Vue.prototype.downloadUrlFile = function (url, filename) {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.responseType = 'blob'
      xhr.onload = () => {
        if (xhr.status === 200) {
          // 获取图片blob数据并保存
          var blob = xhr.response
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download = filename
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
        }
      }

      xhr.send()
    }
  }
}
