
function InterceptorManager() {
  this.handlers = []
}

/**
 * 将一个新的拦截器添加到堆栈中
 *
 * @param {Function} 处理 Promise 的 then 函数的方法
 * @param {Function} 处理 Promise 的 reject 函数的方法
 *
 * @return {Number} 一个用于稍后移除拦截器的 ID
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  })
  return this.handlers.length - 1
}

/**
 * 从堆栈中移除拦截器
 *
 * @param {Number} id 由 use方法 返回的 ID
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null
  }
}

/**
 * 遍历所有已注册的拦截器
 *
 * 这个方法特别适用于跳过可能因为调用 eject方法 而变为 null 的任何拦截器
 *
 * @param {Function} fn 调用每个拦截器的函数
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  this.handlers.forEach(h => {
    if (h !== null) {
      fn(h)
    }
  })
}

export default InterceptorManager
