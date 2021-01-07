//------------------ Actions -------------

// ACTION-TYPES:
export const INCREMENT = "INCREMENT";
export const DECREMENT = "DECREMENT";

// ACTION-CREATORS:
export const incrementAction = payload => {
  return { type: INCREMENT, payload };
};
export const decrementAction = payload => {
  return { type: DECREMENT, payload };
};

//------------------ Reducers -------------

const defaultState = { counter: 0 };

export const appReducer = (state = defaultState, action) => {
  console.log("appReducer:", { state, action });
  switch (action.type) {
    case INCREMENT:
      return { ...state, counter: state.counter + action.payload.amount };
    case DECREMENT:
      return { ...state, counter: state.counter - action.payload.amount };
    default:
      return state;
  }
};

//------------------ Store -------------
import { createStore, combineReducers } from "redux";

const rootReducer = combineReducers({
  appState: appReducer
});

export const appStore = createStore(rootReducer);
