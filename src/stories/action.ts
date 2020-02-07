
import { TEST_ACTION, TEST_ASYNC_ACTION } from './enums'
import { createPayloadAction } from '../modules/creator'

const sleep = (timeountMS: any) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeountMS)
  })

const getName = async ({key}: any = {}) => {
    await sleep(500)
    if (key === '1') {
        throw new Error('key === 1')
    }
    return 'GetNameSuccess'
}

// const storageCache = (key) => {
//     if (key) {

//     }
// }

export const testAction = {
    setName: createPayloadAction(TEST_ACTION.SET_NAME)
}

export const testAsyncAction = {
    getName: (key: any) => ({
        type: TEST_ASYNC_ACTION.GET_NAME,
        target: getName,
        meta: { key },
        failure: TEST_ACTION.SET_ERROR,
        success: testAction.setName,
    }),
}
