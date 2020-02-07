import React from 'react'
import { storiesOf } from '@storybook/react'

import { configureStore } from '../modules/store'
import { Provider } from 'react-redux'
import { createSlice } from '../modules/creator'
import { useActionCallback, usePreviousForNull } from '../modules/hooks'
import { testReducer } from './reducer'
import { testAsyncAction, testAction } from './action'

export const testSlice = createSlice('test', {
    testReducer,
  })

const store = configureStore({
  injector: testSlice.injector,
})

const BasicTestContainer = () => {
    const [getName, nameLoading] = testSlice.useAction(testAsyncAction.getName)
    const [setName] = testSlice.useAction(testAction.setName)
    const name = testSlice.useSelector((state: any) => state.testReducer.name)
    const cacheName = usePreviousForNull(name)

    const onSetName = () => {
        setName('ON SET NAME')
    }

    const [onGetName] = useActionCallback(async (e: any) => {
      await getName(name)
    }, [name])

    const [onGetNameError, nameError] = useActionCallback(async (e: any) => {
        await getName('1')
    }, [name])

    React.useEffect(() => {
        getName()
    }, [])

    return (
        <div>
            <div>GET NAME ACTION: {!nameLoading ? JSON.stringify(name) : 'loading...'}</div>
            <div>NAME: {JSON.stringify(name)}</div>
            <div>CACHE NAME: {cacheName ? cacheName : 'loading...'}</div>
            <div>GET NAME ERROR: {nameError && nameError.message}</div>
            <div style={{ marginTop: '30px'}}>
                <div onClick={onGetName}>ON GET NAME</div>
                <div onClick={onSetName}>ON SET NAME</div>
                <div onClick={onGetNameError}>ON GET NAME ERROR</div>
            </div>
        </div>
    )
}

// ; (top as any)['store'] = store

storiesOf('Container', module).add('basic', () =>  (
<Provider store={store}><BasicTestContainer /> </Provider>
))
