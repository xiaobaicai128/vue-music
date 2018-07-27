/*
* @Author: qiaoyong
* @Date:   2018-07-20 21:24:30
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2018-07-25 19:19:06
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
