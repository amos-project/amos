# Amos

一个分布式的 React 状态管理库.

## 缓存

在调用 `store.select(selectable, discard?)` 的时候, 会缓存 `selectable`
的执行结果, 其机制是:

1. 如果 `selectable` 是一个 `Box`, 则永远不会缓存
2. 如果 `selectable` 是一个 `FunctionSelector`, 则永远不会缓存,
   其依赖的 `Selector` 会被缓存到 `latest` 节点上.
3. 否则, `selectable` 是一个 `Selector`(或者无参数的 `SelectorFactory`),
   如果 `discard` 为 `undefined`, 则会缓存到 `latest` 上, 否则会缓存到
   `tree` 中, 如果是后者, 也会同步更新 `latest` 节点.

   1. 依赖的 `Selector` 缓存机制与之相同
   2. `discard` 为 `Selector` 则会被删除(如果依赖为空), 会同步删除 `Selector`
      依赖的项目(递归).

举例:

1. `store.select(box)`: 永远重新从 snapshot 中取值
2. `store.select(fn)`: 永远重新执行 `fn`, 但是其内部依赖的 `selector`
   会优先从 `latest` 中读取, 如果未命中, 会将最新结果写入 `latest`.
3. `store.select(selector)`: 先从 `latest` 中获取, 未命中则重新计算并更新
   `latest`, 其内部依赖的 `selector` 处理和 `2` 一样.
4. `store.select(selector, discard)`: `selector` 会先从 `tree` 中获取,
   未命中则计算并写入 `tree` 和 `latest`, 其依赖项处理机制相同,
