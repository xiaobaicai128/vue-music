import Vue from 'vue'
import Router from 'vue-router'

import Rank from 'components/rank/rank'
import Recommend from 'components/recommend/recommend'
import Search from 'components/search/search'
import Singer from 'components/singer/singer'
import SingerDetail from 'components/singer-detail/singer-detail'
import Desc from 'components/description/desc'
import TopList from 'components/toplist/toplist'
import UserCenter from 'components/user-center/user-center'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend',
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [{
        path: ':id',
        component: Desc
      }],
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/singer',
      component: Singer,
      children: [{ // 配置子路由
        path: ':id', // 注意冒号不要掉
        component: SingerDetail
      }],
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/rank',
      component: Rank,
      children: [{
        path: ':id',
        component: TopList
      }],
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/search',
      component: Search,
      children: [{
        path: ':id',
        component: SingerDetail
      }],
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
