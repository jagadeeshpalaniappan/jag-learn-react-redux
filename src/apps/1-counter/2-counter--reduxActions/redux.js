//------------------ Actions -------------
import { createActions, handleActions } from "redux-actions";

export const { incrementAction, decrementAction } = createActions(
  "INCREMENT_ACTION",
  "DECREMENT_ACTION"
);

//------------------ Reducers -------------
const defaultState = { counter: 0 };

export const appReducer = handleActions(
  {
    [incrementAction]: (state, { payload }) => {
      return { ...state, counter: state.counter + payload.amount };
    },
    [decrementAction]: (state, { payload }) => {
      return { ...state, counter: state.counter - payload.amount };
    }
  },
  defaultState
);

//------------------ Store -------------
import { createStore, combineReducers } from "redux";

const rootReducer = combineReducers({
  appState: appReducer
});

export const appStore = createStore(rootReducer);
