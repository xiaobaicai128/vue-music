/*
* @Author: qiaoyong
* @Date:   2018-08-19 21:56:16
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2018-08-26 15:00:46
*/
// 洗牌函数  打乱数组

function getRandom (min, max) { // 获得min max之间的随机整数
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export function shuffle (arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandom(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}
// 节流函数
export function deBounce (func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
