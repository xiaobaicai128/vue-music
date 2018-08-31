/*
* @Author: qiaoyong
* @Date:   2018-08-25 15:00:15
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2018-08-25 21:25:10
*/
import jsonp from 'common/js/jsonp.js'
import {options} from './config.js'
import axios from 'axios'

export function getSearchHot () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    _: 1535180028434
  })

  return jsonp(url, data, options)
}

export function search (Query, page, zhida, perpage) {
  const url = '/api/getSearch'

  const data = Object.assign({}, {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    w: Query,
    zhidaqu: zhida,
    catZhida: zhida ? 1 : 0,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: perpage,
    n: perpage,
    p: page,
    remoteplace: 'txt.mqq.all',
    _: 1535188357806
  })
  return axios.get(url, {params: data}).then((res) => {
    return Promise.resolve(res.data)
  })
}
