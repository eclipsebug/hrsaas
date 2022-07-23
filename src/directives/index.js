// 定义自定义指令
// 解决图片报错问题

export const imgError = {
  inserted(el, options) {
    //  el：指令所绑定的元素，可以用来直接操作DOM
    console.log(el)
    el.onerror = function() {
      el.src = options.value
    }
  }
}

export const focus = {
  inserted(el, options) {
    el.focus()
  }
}
