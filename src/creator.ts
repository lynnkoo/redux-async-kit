import * as loadable from 'react-loadable'
import { injectReducers } from './injector'
import produce from 'immer'
import { cloneDeep } from 'lodash'

const NoLoading: React.FC = () => {
  return null
}

export function createSlice(name: string, opts: any) {
  const { reducers = {}, loader, loading } = opts
  return loadable({
    loader: () => {
      if (reducers) {
        injectReducers(reducers, name)
      }
      return loader()
    },
    loading: loading || NoLoading,
  })
}

export function createReducer(initialState: any, reducerMap: any) {
  return (injectState: any = initialState) => {
    const injectedState = cloneDeep(Object.assign(initialState, injectState))
    return produce((state: any = injectedState, action: any) => {
      const { __values__: { scope } = {} as any } = state
      const { __values__: { scope: actionScope } = {} as any } = action
      if (scope && scope !== actionScope) {
        return state
      }
      const reducer = reducerMap(state)[action.type]
      if (reducer) {
        return reducer(action)
      }
      return state
    })
  }
}
