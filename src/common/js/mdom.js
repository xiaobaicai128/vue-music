/*
* @Author: qiaoyong
* @Date:   2018-07-20 21:24:30
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2018-07-30 19:48:55
*/
export function hasClass (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
export function addClass (el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ') // 将el所有的类全部拆开成数组
  newClass.push(className) // 将新的类加到数组中
  el.className = newClass.join(' ') // 合并新的类集合
}
export function getData (el, name, value) {
  const prefix = 'data-'
  const newName = prefix + name
  if (value) { // 如果有这个值 就获取 返回
    return el.setAttribute(newName, value)
  }
  if (!value) { // 如果没有这个值， 就设置并返回
    return el.getAttribute(newName)
  }
}

// 性能测试 添加浏览器私有前缀
let elementStyle = document.createElement('div').style // 创建一个div

let vendor = (() => { // 立即执行函数
  let transformNames = { // 设置浏览器
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()
export function preFixStyle (style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1) // 首字母大写
}
