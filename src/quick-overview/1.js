import React from "react";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";

//------------------ Actions -------------

// ACTION-TYPES:
const INCREMENT = "INCREMENT";
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

const rootReducer = combineReducers({
  appState: appReducer
});

const appStore = createStore(rootReducer);

//------------------ Components -------------

const Counter = ({ counter, increment, decrement }) => {
  console.log("Counter");
  return (
    <div>
      <h3>Counter: (Simple)</h3>
      <div>
        <span>## {counter} ## </span>
        <button onClick={() => increment({ amount: 1 })}>INCREMENT</button>
        <button onClick={() => decrement({ amount: 1 })}>DECREMENT</button>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    counter: state.appState.counter
  };
};

const mapDispatchToProps = dispatch => {
  return {
    increment: payload => dispatch(incrementAction(payload)),
    decrement: payload => dispatch(decrementAction(payload))
  };
};

const CounterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Counter));

const App = () => {
  return (
    <Provider store={appStore}>
      <CounterContainer />
    </Provider>
  );
};

export default App;
