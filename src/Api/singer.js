/*
* @Author: qiaoyong
* @Date:   2018-07-22 20:27:06
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2018-07-27 22:53:37
*/
import jsonp from 'common/js/jsonp.js'
import {options, commonParams} from './config.js'
// import axios from 'axios'
export function getSingerList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })
  return jsonp(url, data, options)
}
export function getSingerDetail (singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, {
    singermid: singerId,
    g_tk: 5381,
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5page',
    needNewCode: 1,
    order: 'listen',
    from: 'h5',
    num: 100,
    begin: 0
  })
  return jsonp(url, data, options)
}
