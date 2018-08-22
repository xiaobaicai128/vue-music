/*
* @Author: qiaoyong
* @Date:   2018-08-20 10:53:32
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2018-08-20 14:12:57
*/
// import {commonParams} from './config.js'
import axios from 'axios'

export function getLyric (id) {
  const url = '/api/getLyric'

  const data = Object.assign({}, {
    musicid: id,
    // platform: 'yqq',
    hostUin: 0,
    g_tk: 5381,
    needNewCode: 1,
    format: 'json',
    // pcachetime: +new Date(),
    uin: 0,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    nobase64: 1,
    songtype: 0,
    _: 1534733486240,
    jsonpCallback: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
