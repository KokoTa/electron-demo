// 工具函数，遵从 commonjs 规范

exports.$ = (id) => {
  return document.querySelector(id)
}

exports.convertDuration = (time) => {
  // 注意这里使用了 字符串转数字 的特性
  const minutes = '0' + Math.floor(time / 60)
  const seconds = '0' + Math.floor(time - minutes * 60)
  return minutes.substr(-2) + ':' + seconds.substr(-2)
}
