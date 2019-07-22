import * as types from './mutation-types'
const matations = {
  /**
   * state:当前状态树
   * v: 提交matations时传的参数
   */
  [types.INCREMENT] (state) {
    const obj = state
    obj.count += 1
  },
  [types.DECREMENT] (state) {
    const obj = state
    obj.count -= 1
  }
}

export default matations
