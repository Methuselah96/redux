import { combineReducers, createStore } from '../..'
import { expectError } from 'tsd'

/**
 * verify that replaceReducer maintains strict typing if the new types change
 */
const bar = (state = { value: 'bar' }) => state
const baz = (state = { value: 'baz' }) => state
const ACTION = {
  type: 'action'
}

const originalCompositeReducer = combineReducers({ bar })
const store = createStore(originalCompositeReducer)
store.dispatch(ACTION)

const firstState = store.getState()
firstState.bar.value
expectError(firstState.baz.value)

const nextStore = store.replaceReducer(combineReducers({ baz })) // returns ->  { baz: { value: 'baz' }}

const nextState = nextStore.getState()
expectError(nextState.bar.value)
nextState.baz.value
