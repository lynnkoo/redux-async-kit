export const asyncMiddleware = ({ dispatch, getState }: any) => {
  return (next: any) => (action: any) => {
    const { target, type, success, meta, payload, failure, cache, selector } = action
    const { __values__ } = action
    if (target) {
      return async () => {
        const selected = selector && selector(getState())
        const params = typeof meta === 'function' ? meta(selected || {}) : meta
        const base: any = { __values__ }
        if (params) {
          base.meta = params
        }
        dispatch({ type, ...base })
        try {
          const cached = cache && cache(params)
          if (cached && typeof cached !== 'function') {
            return cached
          }
          const response = await target(params, dispatch)
          const data = payload ? payload(response) : response
          if (success) {
            if (cached === 'function') {
              cached(data)
            }
            dispatch({ ...success(data), ...base })
          }
          return data
        } catch (e) {
          if (failure) {
            dispatch({ type: failure, error: e, ...base })
          }
          throw e
        }
      }
    }
    return next(action)
  }
}
