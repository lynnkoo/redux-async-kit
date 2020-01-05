import * as React from 'react'
import * as Redux from 'react-redux'
import { createSelector } from 'reselect'

const sleep = (timeount: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeount)
  })

export function useScopedAction(name: string, action: any, deps: any[] = []) {
  const dispatch = Redux.useDispatch()
  const [loading, setLoading] = React.useState(false)
  const actionCreator = useAsyncCallback(async (...opts: any[]) => {
    const values = name ? { __values__: { scope: name } } : {}
    const promise = dispatch({ ...action(...opts), ...values })
    if (promise instanceof Function) {
      setLoading(true)
      try {
        await promise()
        // 正常浏览器下，reducer 中的后续操作会阻塞线程，useCurrentCallback 应该拿到的都是最新数据
        // 如果有浏览器不兼容，可以尝试休眠解决
        // await sleep(10)
      } finally {
        setLoading(false)
      }
    }
  }, deps)
  return [actionCreator, loading]
}

// export function useGlobalAction(action: any, deps: any[] = []) {
//   const actions = useScopedAction('', action, deps)
//   return actions
// }

function createSelectorMemo(selector: any) {
  return () => createSelector(selector, (state: any) => state)
}

export function useScopedSelector(name: string, selector: any) {
  const memoSelector = React.useMemo(createSelectorMemo(selector), [])
  return Redux.useSelector((state: any) => {
    if (!name) {
      return memoSelector(state)
    }
    const scoped = state[name]
    if (scoped) {
      return memoSelector(scoped)
    }
  })
}

// export function useGlobalSelector(selector: any) {
//   return useScopedSelector('', selector)
// }

export function useAsyncCallback(callback: any, deps: any = []) {
  return React.useMemo(() => {
    return callback
  }, deps)
}

export function useCurrentCallback(callback: any, deps: any[] = []) {
  const ref = React.useRef(callback)
  React.useEffect(() => {
    ref.current = callback
  }, deps)
  return ref
}

export function useActionCallback(callback: any, deps: any = []) {
  const [error, setError] = React.useState(null)
  const promise = React.useMemo(() => {
    return async () => {
      setError(null)
      try {
        await callback()
      } catch (e) {
        setError(e)
      }
    }
  }, deps)
  return [promise, error]
}
