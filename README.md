## redux - async - kit

   This is a scoped redux reducer kit

## Usage

   You can run project by `npm start` to start storybook.

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

import { TEST_ACTION, TEST_ASYNC_ACTION } from './enums'
import { createPayloadAction } from '../modules/creator'
import { testSlice } from '.'
import { testSelector } from './selectors'
import { memoryCache } from '../modules/cache'

const sleep = (timeountMS: any) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeountMS)
  })

const getName = async ({ count, keyword }: any = {}) => {
    await sleep(1000)
    if (keyword === '1') {
        throw new Error('keyword === 1')
    }
    return 'GetNameSuccess' + count
}

const getDetail = async ({ name }: any = {}) => {
    await sleep(500)
    return 'GetDetailSuccess:' + name
}

export const testAction = {
    setName: createPayloadAction(TEST_ACTION.SET_NAME),
    setDetail: createPayloadAction(TEST_ACTION.SET_DETAIL),
}

export const testAsyncAction = {
    getName: (count: any, keyword: any) => ({
        type: TEST_ASYNC_ACTION.GET_NAME,
        meta: { count, keyword },
        target: getName,
        success: testAction.setName,
        failure: TEST_ACTION.SET_ERROR,
    }),
    getDetail: () => ({
        type: TEST_ASYNC_ACTION.GET_DETAIL,
        target: getDetail,
        selector: {
            name: testSlice.selector(testSelector.testName),
        },
        meta: ({ name }: any) => ({ name }),
        failure: TEST_ACTION.SET_ERROR,
        success: testAction.setDetail,
    }),
    getDetailByCache: (keyword: any) => ({
        type: TEST_ASYNC_ACTION.GET_DETAIL,
        target: getDetail,
        selector: {
            name: testSlice.selector(testSelector.testName),
        },
        meta: ({ name }: any) => ({ name }),
        cache: ({ meta }: any) => memoryCache(meta),
        failure: TEST_ACTION.SET_ERROR,
        success: testAction.setDetail,
    }),
}

```

## Store

```javascript
import { configureStore createLazyComponent } from 'redux-async-kit'
const store = configureStore({
  injector: testSlice.injector,
})

// inject by dynamic
const HomePage = createLazyComponent({
  injector: homeSlice.injector,
  loader: () => import('./TestPage' /* webpackChunkName: "home" */),
})

```

## Hooks

```javascript

const TestComponent = () => {
    const [count, setCount] = React.useState(0)
    const [name, cacheName] = testSlice.useSelector(testSelector.testName)
    const [detail] = testSlice.useSelector(testSelector.testDetail)
    const [setName] = testSlice.useAction(testAction.setName)
    const [getName, nameState] = testSlice.useAction(testAsyncAction.getName)
    const [getDetail, detailState] = testSlice.useAction(testAsyncAction.getDetail)
    const [getDetailByCache, detailCacheState] = testSlice.useAction(testAsyncAction.getDetailByCache)

    const onSetName = () => {
        setName('ON SET NAME')
    }

    const onGetName = useAsyncCallback(async (e: any) => {
        await getName(count)
        await getDetail()
    }, [count])

    const onGetNameByKeyword = useAsyncCallback((keyword: any) => async (e: any) => {
        await getName(count, keyword)
        await getDetail()
    }, [count])

    const onGetDetailByCache = useAsyncCallback(async (e: any) => {
        await getDetailByCache()
    }, [count])

    const onGetDetail = useAsyncCallback(async (e: any) => {
        await getDetail()
    }, [count])

    useAsyncEffect(async () => {
        await getName(count)
        await getDetailByCache()
    })

  return (
    <div> ... </div>
  )
}

```

   Thanks
