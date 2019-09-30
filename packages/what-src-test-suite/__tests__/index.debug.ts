import * as U from '@what-src/utils'

(async function() {
  console.log('hat')
  const getState = () => {
    let state = 0
    const incrementCounter = () => state++
    const operation = () => new Promise((resolve, reject) => {
      incrementCounter()
      console.log(state)
      if (state < 3) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject()
      } else {
        resolve()
      }
    })
    return { state, incrementCounter, operation }
  }
  const { operation } = getState()
  try {
    const res = await U.retryOperation(operation, 5, 1)
    console.log(res)
  } catch (err) {
    console.log('Error!!!', err)
  }
})()
