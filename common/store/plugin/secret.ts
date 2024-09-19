// 为安装此插件后创建的每个store添加一个名为 `secret` 的属性
// 这可能在不同的文件中
export default function SecretPiniaPlugin() {
  return { secret: 'the cake is a lie' }
}