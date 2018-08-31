import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 100

const FAVORITE_KEY = '__FAVORITE__'
const FAVORITE_MAX_LENGTH = 100

// 插入函数
function insertArr (arr, val, compare, maxLength) {
  let index = arr.findIndex(compare) // 通过查找compare比较函数 看原数组中有没有该数据 findIndex ES6 API
  if (index === 0) { // 如果有且是第一个
    return
  }
  if (index > 0) {
    arr.splice(index, 1) // 如果有，但不是第一个 删掉原来数据
  }
  arr.unshift(val) // 在arr第一的位置插入 目标数据

  if (maxLength && arr.length > maxLength) { // 若数据个数多余最大限数，去掉末尾最后一个数据
    arr.pop() // 删掉并返回最后一个数据
  }
}

// 删除函数
function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
export function saveSearch (query) {
  let searches = storage.get(SEARCH_KEY, []) // 将数据写到本地存储storage中的searchs 若没有数据则创建空数组searchs
  insertArr(searches, query, (item) => { // 将query插入到searchs
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches) // 保存一下
  return searches
}

export function loadSearch () {
  return storage.get(SEARCH_KEY, []) // 为storage创建一个空数组
}

export function deleteSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}

export function savePlay (song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArr(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay () {
  return storage.get(PLAY_KEY, [])
}

export function saveFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArr(songs, song, (item) => {
    return item.id === song.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorit () {
  return storage.get(FAVORITE_KEY, [])
}
