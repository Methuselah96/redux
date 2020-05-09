import { Dispatch, Action } from '../..'
import { expectError } from 'tsd'

interface Component<P> {
  props: P
}

interface HOC<T> {
  <P>(wrapped: Component<P & T>): Component<P>
}

declare function connect<T, D extends Dispatch = Dispatch>(
  mapDispatchToProps: (dispatch: D) => T
): HOC<T>

/**
 * Inject default dispatch.
 */
function simple() {
  const hoc: HOC<{ onClick(): void }> = connect(dispatch => {
    return {
      onClick() {
        dispatch({ type: 'INCREMENT' })
        expectError(dispatch(Promise.resolve({ type: 'INCREMENT' })))
        expectError(dispatch('not-an-action'))
      }
    }
  })
}

/**
 * Inject dispatch that restricts allowed action types.
 */
function discriminated() {
  interface IncrementAction {
    type: 'INCREMENT'
    count?: number
  }

  interface DecrementAction {
    type: 'DECREMENT'
    count?: number
  }

  // Union of all actions in the app.
  type MyAction = IncrementAction | DecrementAction

  const hoc: HOC<{ onClick(): void }> = connect(
    (dispatch: Dispatch<MyAction>) => {
      return {
        onClick() {
          dispatch({ type: 'INCREMENT' })
          dispatch({ type: 'DECREMENT', count: 10 })
          expectError(dispatch({ type: 'DECREMENT', count: '' }))
          expectError(dispatch({ type: 'SOME_OTHER_TYPE' }))
          expectError(dispatch('not-an-action'))
        }
      }
    }
  )
}

/**
 * Inject extended dispatch.
 */
function promise() {
  type PromiseDispatch = <T extends Action>(promise: Promise<T>) => Promise<T>

  type MyDispatch = Dispatch & PromiseDispatch

  const hoc: HOC<{ onClick(): void }> = connect((dispatch: MyDispatch) => {
    return {
      onClick() {
        dispatch({ type: 'INCREMENT' })
        dispatch(Promise.resolve({ type: 'INCREMENT' }))
        expectError(dispatch('not-an-action'))
      }
    }
  })
}
