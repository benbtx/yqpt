// import { Loading } from 'element-ui'
import { Spin } from 'iview'

import { debounce } from 'lodash'

function startLoading () {
  Spin.show({
    render: (h) => {
      return h('div', [
        h('Icon', {
          'class': 'demo-spin-icon-load',
          props: {
            type: 'ios-loading',
            size: 18
          }
        }),
        h('div', '加载中')
      ])
    }
  })
}
function endLoading () {
  Spin.hide()
}
const tryCloseLoading = () => {
  if (needLoadingRequestCount === 0) {
    Spin.hide()
  }
}
let needLoadingRequestCount = 0
console.log('1：' + needLoadingRequestCount)

export function showFullScreenLoading () {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++

  console.log('2：' + needLoadingRequestCount)
}
export function tryHideFullScreenLoading () {
  console.log('3：' + needLoadingRequestCount)

  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    // endLoading();
    debounce(tryCloseLoading, 600)()
  }
}
