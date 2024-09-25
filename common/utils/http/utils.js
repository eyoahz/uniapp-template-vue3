
let toString = Object.prototype.toString // var变为let

/**
 * 确定值是否为 Array
 *
 * @param {Object} val
 * @returns {boolean}
 */
export function isArray (val) {
  return toString.call(val) === '[object Array]'
}


/**
 * 确定值是否为 object 对象
 *
 * @param {Object} val
 * @returns {boolean}
 */
export function isObject (val) {
  return val !== null && typeof val === 'object'
}

/**
 * 确定值是否为 Date对象
 *
 * @param {Object} val
 * @returns {boolean}
 */
export function isDate (val) {
  return toString.call(val) === '[object Date]'
}

/**
 * 确定值是否为 URL 的查询字符串实例
 *
 * @param {Object} val
 * @returns {boolean}
 */
export function isURLSearchParams (val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams
}

/**
 * 是否为 boolean 值
 * @param val
 * @returns {boolean}
 */
export function isBoolean(val) {
  return typeof val === 'boolean'
}

/**
 * 是否为真正的对象{} new Object
 * 
 * @param {any} obj - 检测的对象
 * @returns {boolean}
 */
export function isPlainObject(obj) {
  // return Object.prototype.toString.call(obj) === '[object Object]'
  return toString.call(obj) === '[object Object]'
}

/**
 * 是否为字符串
 * 
 * @param {String} str
 * @returns {boolean}
 */
export function isString(str) {
	return typeof str === 'string'
}

/**
 * 遍历数组或对象，并针对每个项调用一个函数
 *
 * 如果 obj 是一个数组，对于每个项，回调函数将被调用，并传递该项的值、索引和完整的数组
 *
 * 如果 obj 是一个对象，对于每个属性，回调函数将被调用，并传递该属性的值、键和完整的对象
 *
 * @param {Object|Array} obj
 * @param {Function} fn 每个项的回调函数调用
 */
export function forEach (obj, fn) {
  if (obj === null || typeof obj === 'undefined') {
    return
  }

  // 不可遍历的话，将其强制转化为 Array
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj]
  }

  if (isArray(obj)) {
    // 遍历 Array 中的元素
    for (let i = 0, l = obj.length; i < l; i++) {	 // var变为let
      fn.call(null, obj[i], i, obj)		// 传递该项的值、索引和完整的数组
    }
  } else {
    // 遍历 object 的中 key（键）
    for (let key in obj) {		 // var变为let
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj)		// 传递该属性的值、键和完整的对象
      }
    }
  }
}

/**
 * 与 合并 相等的函数，唯一的区别是不保留对原始对象的引用。
 *
 * @see merge
 * @param {Object} obj1
 * @returns {Object} 合并所有属性的结果
 */
export function deepMerge(/* obj1, obj2, obj3, ... */) {
  let result = {}
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val)
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val)
    } else {
      result[key] = val
    }
  }
  for (let i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue)
  }
  return result
}

export function isUndefined (val) {
  return typeof val === 'undefined'
}

/**
 * 根据传入的key获取obj对象的属性值
 * @param {Object} obj
 * @param {String | Array} key
 * @returns 传入对象相应的属性值
 */
export function getValueByField(obj = {}, key) {
	let respond = {}
	if (isString(key) && key !== '') {
		respond = obj[key]
	} else if (isArray(key)) {
		respond = obj[key[0]]
		for(let i = 1; i < key.length; i++) {
			respond = respond[key[i]]
			if(!isPlainObject(respond)) break;
		}
	}
	return respond
}