## redux - async - kit

   This is a scoped redux reducer kit

## Usage

## Slice

```javascript
import { createSlice } from 'redux-async-kit'
export const testSlice = createSlice('test', {
  testScope: testReducer,
})
```

   The reducer must created by ** createReducer **

## Reducer

```javascript
import { createReducer } from 'redux-async-kit'
const initialState = {
  name: 'testName',
}
const reducerMap = (state: any) => ({
  TEST_ACTION: () => {
    return {
      name: 'testAction',
    }
  },
  TEST_ACTION_IMMER: (action) => {
    // usage by immer
    state.name = action.payload
  },
})
export const testReducer = createReducer(initialState, reducerMap)
```

## Action

```javascript
function createAction(type: string) {
  return (payload: any) => ({ type, payload })
}

export const testAction = {
  testSuccess: createAction('TEST_ASYNC_ACTION_SUCCESS'),
}

export const testAsyncAction = {
  getInfo: (testMeta) => ({
    type: 'TEST_ASYNC_ACTION',
    meta: { testMeta },
    target: async (params) => { ... }
    failure: 'TEST_ASYNC_ACTION_ERROR',
    success: testAction.testSuccess,
  }),
}
```

## Store

```javascript
import { configureStore createLazyComponent } from 'redux-async-kit'
const store = configureStore({
  injector: testSlice.injector,
})

// export function createLazyComponent(opts: any) {
//   const { loader, injector } = opts
//   return React.lazy(() => {
//     injector()
//     return loader()
//   })
// }

// inject by dynamic
const HomePage = createLazyComponent({
  injector: homeSlice.injector,
  loader: () => import('./TestPage' /* webpackChunkName: "home" */),
})

```

## Hooks

```javascript

const TestComponent = () => {
  const [getInfo, infoLoading] = testSlice.useAction(testAsyncAction.getInfo)
  const name = testSlice.useSelector((state: any) => state.testScope.name)

  const onGotInfo = useCurrentCallback(() => {
      if (name === '...') { ... }
  }, [name])

  const [onGetInfo, infoError] = useActionCallback(async () => {
    await getInfo('xxx')
    onGotInfo.current()
  }, [name])

  return (
    <div onClick={onGetInfo}>Test Action</div>
  )
}

```

   Thanks
